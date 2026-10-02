import { Router } from "express";
import jwt from "jsonwebtoken";
import User from "../model/user.model";
import bcrypt from "bcrypt";

const router = Router();
const jwtSecret = process.env.JWT_SECRET;

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
    if (!jwtSecret) {
      console.error("JWT_SECRET is not configured");
      res.status(500).json({ message: "Authentication is not configured" });
      return;
    }

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

   const isPasswordValid = await bcrypt.compare(password, user?.password!)

    if (!user || !isPasswordValid) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        role: user.role
      },
      jwtSecret,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
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

export default router;
