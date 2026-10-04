import config from "../config/config.js";
import { HttpError } from "../utils/httpError.js";
import { stripHtml, decodeEntities } from "../utils/text.js";

const BASE = "https://jobicy.com/api/v2/remote-jobs";
const cache = new Map(); // key -> { expires, value }

const withCache = async (key, ttl, loader) => {
  const hit = cache.get(key);
  if (hit && hit.expires > Date.now()) return hit.value;
  const value = await loader();
  cache.set(key, { expires: Date.now() + ttl, value });
  return value;
};

const callJobicy = async (params) => {
  const url = `${BASE}?${new URLSearchParams(params)}`;
  let res;
  try {
    res = await fetch(url, { headers: { Accept: "application/json" }, signal: AbortSignal.timeout(10000) });
  } catch {
    throw new HttpError(502, "Could not reach the Jobicy API");
  }
  if (!res.ok) throw new HttpError(502, `Jobicy API answered with ${res.status}`);
  return res.json();
};

const asArray = (v) => (Array.isArray(v) ? v : v ? [v] : []);

const normalizeJob = (j) => ({
  id: String(j.id),
  title: decodeEntities(j.jobTitle || ""),
  company: decodeEntities(j.companyName || ""),
  logo: j.companyLogo || null,
  industry: asArray(j.jobIndustry).map(decodeEntities),
  type: asArray(j.jobType).map(decodeEntities),
  geo: decodeEntities(Array.isArray(j.jobGeo) ? j.jobGeo.join(", ") : j.jobGeo || "Anywhere"),
  level: j.jobLevel || null,
  excerpt: stripHtml(j.jobExcerpt || ""),
  url: j.url,
  postedAt: j.pubDate || null,
  salary:
    j.salaryMin || j.salaryMax
      ? { min: j.salaryMin || null, max: j.salaryMax || null, currency: j.salaryCurrency || "", period: j.salaryPeriod || "" }
      : null
});

const SORTERS = {
  newest: (a, b) => new Date(b.postedAt) - new Date(a.postedAt),
  salary: (a, b) => (b.salary?.max || 0) - (a.salary?.max || 0),
  company: (a, b) => a.company.localeCompare(b.company)
};

export const searchJobs = async ({ count = 30, geo, industry, tag, q, sort = "newest", type }) => {
  const params = { count: Math.min(Math.max(Number(count) || 30, 1), 50) };
  if (geo) params.geo = geo;
  if (industry) params.industry = industry;
  if (tag) params.tag = tag;

  const raw = await withCache(JSON.stringify(params), config.jobsCacheMs, () => callJobicy(params));
  let jobs = (raw.jobs || []).map(normalizeJob);

  // extra filters applied on our side
  if (q) {
    const needle = q.toLowerCase();
    jobs = jobs.filter((j) => `${j.title} ${j.company} ${j.excerpt}`.toLowerCase().includes(needle));
  }
  if (type) jobs = jobs.filter((j) => j.type.some((t) => t.toLowerCase() === type.toLowerCase()));

  jobs.sort(SORTERS[sort] || SORTERS.newest);
  return jobs;
};

// Region / industry lists come from Jobicy itself, so slugs are always valid.
const FALLBACK = {
  locations: [{ slug: "usa", name: "USA" }, { slug: "canada", name: "Canada" }, { slug: "europe", name: "Europe" }, { slug: "france", name: "France" }, { slug: "anywhere", name: "Anywhere" }],
  industries: [{ slug: "marketing", name: "Marketing" }, { slug: "supporting", name: "Customer Support" }, { slug: "copywriting", name: "Copywriting" }, { slug: "business", name: "Business" }]
};

const toOption = (item) => ({
  slug: item.geoSlug || item.industrySlug || item.slug || item.value || item.id,
  name: decodeEntities(item.geoName || item.industryName || item.name || item.label || item.title || "")
});

export const getTaxonomy = (kind) =>
  withCache(`tax:${kind}`, 24 * 60 * 60 * 1000, async () => {
    try {
      const data = await callJobicy({ get: kind });
      const list = Array.isArray(data) ? data : Object.values(data).find(Array.isArray) || [];
      const options = list.map(toOption).filter((o) => o.slug && o.name);
      return options.length ? options : FALLBACK[kind];
    } catch {
      return FALLBACK[kind];
    }
  });
