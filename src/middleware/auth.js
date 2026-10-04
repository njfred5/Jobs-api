import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { HttpError } from "../utils/httpError.js";

export const requireAuth = (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return next(new HttpError(401, "Authentication required"));
  try {
    req.userId = jwt.verify(token, config.jwtSecret).sub;
    next();
  } catch {
    next(new HttpError(401, "Invalid or expired token"));
  }
};
