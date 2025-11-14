import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const response = await fetch("https://jobicy.com/api/v2/remote-jobs?count=20&geo=usa&industry=marketing");
    const data = await response.json();
    if (data.jobs) {
      res.json(data.jobs);
    } else {
      res.json({ error: "No jobs found", raw: data });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch jobs", details: err.message });
  }
});

export default router;
