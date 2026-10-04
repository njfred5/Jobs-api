import { useEffect, useState } from "react";
import { api } from "../api.js";

export default function SearchFilters({ filters, setFilters }) {
  const [options, setOptions] = useState({ locations: [], industries: [], types: [] });

  useEffect(() => {
    api.filters().then(setOptions).catch(() => {});
  }, []);

  const update = (key) => (e) => setFilters((f) => ({ ...f, [key]: e.target.value }));
  const reset = () => setFilters({ q: "", geo: "", industry: "", type: "", sort: "newest", count: "30" });

  return (
    <section className="filters">
      <input
        type="search"
        placeholder="Search title, company, keyword…"
        value={filters.q}
        onChange={update("q")}
        aria-label="Search jobs"
      />

      <select value={filters.geo} onChange={update("geo")} aria-label="Region">
        <option value="">All regions</option>
        {options.locations.map((o) => <option key={o.slug} value={o.slug}>{o.name}</option>)}
      </select>

      <select value={filters.industry} onChange={update("industry")} aria-label="Industry">
        <option value="">All industries</option>
        {options.industries.map((o) => <option key={o.slug} value={o.slug}>{o.name}</option>)}
      </select>

      <select value={filters.type} onChange={update("type")} aria-label="Job type">
        <option value="">Any type</option>
        {options.types.map((t) => <option key={t} value={t}>{t}</option>)}
      </select>

      <select value={filters.sort} onChange={update("sort")} aria-label="Sort by">
        <option value="newest">Newest</option>
        <option value="salary">Highest salary</option>
        <option value="company">Company A–Z</option>
      </select>

      <button className="btn ghost" onClick={reset}>Reset</button>
    </section>
  );
}
