import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required.");
}

export async function login(req, res, next) {
  try {
    const { email, username, password } = req.body;
    const rawIdentifier = email || username || "";

    if (!rawIdentifier.trim() || !password) {
      return res.status(400).json({ message: "Username/email and password are required." });
    }

    const normalizedIdentifier = rawIdentifier.trim().toLowerCase();

    // Support logging in by either email or username
    const foundUser = await User.findOne({
      where: {
        [Op.or]: [
          { email: normalizedIdentifier },
          { username: normalizedIdentifier },
        ],
      },
    });

    if (!foundUser) {
      return res.status(401).json({ message: "Invalid username/email or password." });
    }

    const isMatch = await bcrypt.compare(password, foundUser.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username/email or password." });
    }

    const payload = {
      id: foundUser.id,
      username: foundUser.username,
      email: foundUser.email,
      name: foundUser.name || foundUser.username,
      role: foundUser.role,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });

    return res.json({
      token,
      user: payload,
    });
  } catch (error) {
    next(error);
  }
}

export async function me(req, res, next) {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["passwordHash"] },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.json({ user });
  } catch (error) {
    next(error);
  }
}
