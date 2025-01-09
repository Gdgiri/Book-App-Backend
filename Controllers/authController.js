import Auth from "../Models/authSchema.js";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import nodemailer from "nodemailer";
import crypto from "crypto";

// Register a new user

export const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Check if email is already in use
    const existingUser = await Auth.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Create a new user
    const newUser = new Auth({ username, email, password, role });
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(201).json({
      message: "User registered successfully",
      user: { id: newUser._id, username: newUser.username, role: newUser.role },
      token,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Registration failed", error: error.message });
  }
};

// Login a user

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await Auth.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check if password matches
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.json({
      message: "Login successful",
      user: { id: user._id, username: user.username, role: user.role },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

// Forgot Password

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await Auth.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "User with this email does not exist" });
    }

    // Generate reset token (JWT token)
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetPasswordExpire = Date.now() + 3600000; // 1 hour

    // Save the reset token and expiration date to the user model
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = resetPasswordExpire;
    await user.save();

    // Send the reset token via email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your email password
      },
    });

    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

    const mailOptions = {
      to: email,
      from: process.env.EMAIL_USER,
      subject: "Password Reset Request",
      text: `You requested a password reset. Click the link below to reset your password:\n\n${resetLink}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Password reset link sent to email" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error generating reset token", error: error.message });
  }
};

// Reset Password

export const resetPassword = async (req, res) => {
  const { resetToken } = req.params;
  const { newPassword } = req.body;

  try {
    // Find user by reset token and check if token is expired
    const user = await Auth.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    // Set new password
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
