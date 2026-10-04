import { Router } from "express";
import jwt from "jsonwebtoken";
import User from "../model/user.model";
import bcrypt from "bcrypt";
import { setAuthCookies } from "../utils/cookie";

const router = Router();
const ACCESS_COOKIE = "access_token";

function getAccessToken(req: { headers: { authorization?: string; cookie?: string } }) {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice("Bearer ".length);
  }

  const accessCookie = req.headers.cookie
    ?.split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${ACCESS_COOKIE}=`));

  return accessCookie?.slice(`${ACCESS_COOKIE}=`.length);
}

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body as {
      name?: string;
      email?: string;
      password?: string;
      role?: "user" | "admin";
    };

    if (!name || !email || !password) {
      res.status(400).json({
        message: "Name, email, and password are required"
      });
      return;
    }
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({ message: "Email already in use" });
      return;
    }

    //hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password : hashedPassword,
      role: "user"
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error: unknown) {

    console.error("Registration failed:", error);
    res.status(500).json({ message: "Unable to register user" });
  }
});

router.post("/login", async (req, res) => {
  try {
    // if (!jwtSecret) {
    //   console.error("JWT_SECRET is not configured");
    //   res.status(500).json({ message: "Authentication is not configured" });
    //   return;
    // }

    const { email, password } = req.body as {
      email?: string;
      password?: string;
    };

    if (!email || !password) {
      res.status(400).json({
        message: "Email and password are required"
      });
      return;
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase()
    });

    const isPasswordValid = user
      ? await bcrypt.compare(password, user.password)
      : false;

    if (!user || !isPasswordValid) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    setAuthCookies(res, user._id.toString(), user.role);


    res.status(200).json({
      message: "Login successful",
      
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error: unknown) {
    console.error("Login failed:", error);
    res.status(500).json({ message: "Unable to login user" });
  }
});

router.get("/me", async (req, res) => {
  try {
    const token = getAccessToken(req);
    if (!token) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    let decoded: { userid: string; role: string };
    try {
      decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as {
        userid: string;
        role: string;
      };
    } catch {
      res.status(401).json({ message: "Invalid or expired authentication token" });
      return;
    }

    const user = await User.findById(decoded.userid).select("-password");

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
    
  } catch (error: unknown) {
    console.error("Fetching user info failed:", error);
    res.status(500).json({ message: "Unable to fetch user info" });
  }
});

export default router;
