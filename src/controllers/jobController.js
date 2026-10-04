import * as jobService from "../services/jobService.js";

export const listJobs = async (req, res) => {
  const { count, geo, industry, tag, q, sort, type } = req.query;
  const jobs = await jobService.searchJobs({ count, geo, industry, tag, q, sort, type });
  res.json({ count: jobs.length, jobs });
};

export const filters = async (req, res) => {
  const [locations, industries] = await Promise.all([
    jobService.getTaxonomy("locations"),
    jobService.getTaxonomy("industries")
  ]);
  res.json({ locations, industries, types: ["full-time", "part-time", "contract", "internship"] });
};
