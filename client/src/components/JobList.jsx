import JobCard from "./JobCard.jsx";

export default function JobList({ jobs, loading, error, isSaved, onToggleSave, emptyText }) {
  if (loading) {
    return (
      <div className="grid" aria-busy="true">
        {Array.from({ length: 6 }, (_, i) => <div key={i} className="card skeleton" />)}
      </div>
    );
  }
  if (error) return <p className="state error">⚠️ {error}</p>;
  if (!jobs.length) return <p className="state">{emptyText}</p>;

  return (
    <>
      <p className="muted count">{jobs.length} job{jobs.length > 1 ? "s" : ""}</p>
      <div className="grid">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} saved={isSaved(job.id)} onToggleSave={onToggleSave} />
        ))}
      </div>
    </>
  );
}
