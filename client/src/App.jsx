import { useEffect, useState } from "react";
import Header from "./components/Header.jsx";
import SearchFilters from "./components/SearchFilters.jsx";
import JobList from "./components/JobList.jsx";
import AuthModal from "./components/AuthModal.jsx";
import { useJobs } from "./hooks/useJobs.js";
import { useDebounce } from "./hooks/useDebounce.js";
import { useSavedJobs } from "./hooks/useSavedJobs.js";
import { useAuth } from "./context/AuthContext.jsx";

const DEFAULT_FILTERS = { q: "", geo: "", industry: "", type: "", sort: "newest", count: "30" };

export default function App() {
  const { user } = useAuth();
  const [view, setView] = useState("search");
  const [showAuth, setShowAuth] = useState(false);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
  );

  // wait for the user to stop typing before calling the API
  const debounced = useDebounce(filters);
  const { jobs, loading, error } = useJobs(debounced);
  const { saved, isSaved, toggle } = useSavedJobs();

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  // log out while on the "saved" tab -> go back to search
  useEffect(() => {
    if (!user && view === "saved") setView("search");
  }, [user, view]);

  const onToggleSave = (job) => (user ? toggle(job) : setShowAuth(true));

  return (
    <>
      <Header
        view={view}
        setView={setView}
        savedCount={saved.length}
        onLogin={() => setShowAuth(true)}
        theme={theme}
        toggleTheme={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
      />

      <main className="container">
        {view === "search" ? (
          <>
            <SearchFilters filters={filters} setFilters={setFilters} />
            <JobList
              jobs={jobs}
              loading={loading}
              error={error}
              isSaved={isSaved}
              onToggleSave={onToggleSave}
              emptyText="No jobs match your filters. Try broader keywords."
            />
          </>
        ) : (
          <JobList
            jobs={saved}
            loading={false}
            error={null}
            isSaved={isSaved}
            onToggleSave={onToggleSave}
            emptyText="Nothing saved yet — click ☆ on a job to keep it here."
          />
        )}
      </main>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  );
}
