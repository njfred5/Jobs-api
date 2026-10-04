import SavedJob from "../models/SavedJob.js";
import { HttpError } from "../utils/httpError.js";

export const list = (req, res) => res.json({ jobs: SavedJob.list(req.userId) });

export const add = (req, res) => {
  const job = req.body;
  if (!job?.id || !job?.title || !job?.url) throw new HttpError(400, "A job with id, title and url is required");
  res.status(201).json(SavedJob.add(req.userId, job));
};

export const remove = (req, res) => {
  if (!SavedJob.remove(req.userId, req.params.jobId)) throw new HttpError(404, "Saved job not found");
  res.status(204).send();
};
