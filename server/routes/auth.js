import { Router } from "express";
import { randomUUID } from "crypto";
import {
  createUser,
  getUserByEmail,
  getUserById,
} from "../lib/store.js";
import {
  authRequired,
  createToken,
  hashPassword,
  sanitizeUser,
  verifyPassword,
} from "../lib/auth.js";

const router = Router();

router.post("/register", async (req, res) => {
  const {
    name,
    email,
    password,
    dob,
    age,
    college,
    issues = [],
    about = "",
  } = req.body || {};

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "name, email, and password are required" });
  }

  if (String(password).length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters" });
  }

  const existing = await getUserByEmail(email);
  if (existing) {
    return res.status(409).json({ message: "Email already registered" });
  }

  const now = new Date().toISOString();
  const user = {
    id: randomUUID(),
    name: String(name).trim(),
    email: String(email).toLowerCase().trim(),
    passwordHash: hashPassword(password),
    dob: dob || null,
    age: age ? Number(age) : null,
    college: college || "",
    issues: Array.isArray(issues) ? issues : [],
    about: about || "",
    createdAt: now,
    updatedAt: now,
  };

  await createUser(user);
  const token = createToken(user.id);

  return res.status(201).json({
    token,
    user: sanitizeUser(user),
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = await getUserByEmail(email);
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = createToken(user.id);
  return res.json({
    token,
    user: sanitizeUser(user),
  });
});

router.get("/me", authRequired, async (req, res) => {
  const user = await getUserById(req.userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.json({ user: sanitizeUser(user) });
});

export default router;
