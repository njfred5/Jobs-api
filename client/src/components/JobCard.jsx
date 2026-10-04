import { useState } from "react";

const timeAgo = (iso) => {
  if (!iso) return "";
  const days = Math.floor((Date.now() - new Date(iso)) / 86400000);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  return `${days} days ago`;
};

const formatSalary = (s) => {
  if (!s) return null;
  const fmt = (n) => (n ? Number(n).toLocaleString() : "");
  const range = s.min && s.max ? `${fmt(s.min)} – ${fmt(s.max)}` : fmt(s.min || s.max);
  return `${range} ${s.currency}${s.period ? ` / ${s.period}` : ""}`.trim();
};

export default function JobCard({ job, saved, onToggleSave }) {
  const [open, setOpen] = useState(false);
  const salary = formatSalary(job.salary);

  return (
    <article className="card">
      <div className="card-top">
        {job.logo ? <img src={job.logo} alt="" loading="lazy" className="logo" /> : <div className="logo placeholder">{job.company[0]}</div>}
        <div className="card-main">
          <h3>{job.title}</h3>
          <p className="muted">{job.company} • {job.geo} • {timeAgo(job.postedAt)}</p>
        </div>
        <button
          className={saved ? "icon-btn saved" : "icon-btn"}
          onClick={() => onToggleSave(job)}
          aria-label={saved ? "Remove from saved" : "Save job"}
          title={saved ? "Remove from saved" : "Save job"}
        >
          {saved ? "★" : "☆"}
        </button>
      </div>

      <div className="tags">
        {job.type.map((t) => <span key={t} className="tag">{t}</span>)}
        {job.level && <span className="tag">{job.level}</span>}
        {job.industry.map((i) => <span key={i} className="tag soft">{i}</span>)}
        {salary && <span className="tag salary">💰 {salary}</span>}
      </div>

      {open && job.excerpt && <p className="excerpt">{job.excerpt}</p>}

      <div className="card-actions">
        {job.excerpt && (
          <button className="link" onClick={() => setOpen((o) => !o)}>
            {open ? "Hide details" : "Show details"}
          </button>
        )}
        <a className="btn" href={job.url} target="_blank" rel="noopener noreferrer">View job ↗</a>
      </div>
    </article>
  );
}
