import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import User from "../models/User.js";
import { HttpError } from "../utils/httpError.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const publicUser = (u) => ({ id: u.id, name: u.name, email: u.email });
const signToken = (u) => jwt.sign({ sub: u.id }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });

export const register = async ({ name, email, password }) => {
  name = String(name || "").trim();
  email = String(email || "").trim().toLowerCase();
  password = String(password || "");

  if (name.length < 2) throw new HttpError(400, "Name must be at least 2 characters");
  if (!EMAIL_RE.test(email)) throw new HttpError(400, "A valid email is required");
  if (password.length < 8) throw new HttpError(400, "Password must be at least 8 characters");
  if (User.findByEmail(email)) throw new HttpError(409, "Email already exists");

  const user = User.create({ name, email, passwordHash: await bcrypt.hash(password, 10) });
  return { user: publicUser(user), token: signToken(user) };
};

export const login = async ({ email, password }) => {
  const user = User.findByEmail(String(email || "").trim().toLowerCase());
  // same message for both failures so we don't reveal which emails exist
  if (!user || !(await bcrypt.compare(String(password || ""), user.password_hash))) {
    throw new HttpError(401, "Invalid email or password");
  }
  return { user: publicUser(user), token: signToken(user) };
};

export const getUser = (id) => {
  const user = User.findById(id);
  return user ? publicUser(user) : null;
};
