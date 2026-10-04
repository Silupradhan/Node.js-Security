import { Router } from "express";
import User from "../model/user.model";
import bcrypt from "bcrypt";
import { setAuthCookies } from "../utils/cookie";
import { authMiddleware } from "../middleware/auth.middleware";
import { AuthenticatedRequest } from "../utils/types";

const router = Router();

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

router.get("/me", authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.authUser) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const user = await User.findById(req.authUser.userid).select("-password");

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
