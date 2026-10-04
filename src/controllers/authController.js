import * as authService from "../services/authService.js";
import { HttpError } from "../utils/httpError.js";

export const register = async (req, res) => res.status(201).json(await authService.register(req.body || {}));
export const login = async (req, res) => res.json(await authService.login(req.body || {}));

export const me = (req, res) => {
  const user = authService.getUser(req.userId);
  if (!user) throw new HttpError(404, "User not found");
  res.json({ user });
};
