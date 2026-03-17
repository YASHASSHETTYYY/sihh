import crypto from "crypto";
import jwt from "jsonwebtoken";

const TOKEN_TTL = "7d";

function jwtSecret() {
  return process.env.JWT_SECRET || "dev-only-change-me";
}

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .createHash("sha256")
    .update(`${salt}:${password}`)
    .digest("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password, storedHash) {
  if (!storedHash || !storedHash.includes(":")) {
    return false;
  }

  const [salt, hash] = storedHash.split(":");
  const candidate = crypto
    .createHash("sha256")
    .update(`${salt}:${password}`)
    .digest("hex");

  return crypto.timingSafeEqual(Buffer.from(candidate), Buffer.from(hash));
}

export function createToken(userId) {
  return jwt.sign({ sub: userId }, jwtSecret(), { expiresIn: TOKEN_TTL });
}

export function sanitizeUser(user) {
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

export function authRequired(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : null;

  if (!token) {
    return res.status(401).json({ message: "Missing auth token" });
  }

  try {
    const payload = jwt.verify(token, jwtSecret());
    req.userId = payload.sub;
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
