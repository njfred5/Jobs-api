import { useCallback, useEffect, useState } from "react";
import { api } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

// Saved jobs live on the server when logged in (so they follow you across devices).
export function useSavedJobs() {
  const { user } = useAuth();
  const [saved, setSaved] = useState([]);

  useEffect(() => {
    if (!user) return setSaved([]);
    api.saved().then((d) => setSaved(d.jobs)).catch(() => {});
  }, [user]);

  const isSaved = useCallback((id) => saved.some((j) => j.id === id), [saved]);

  const toggle = useCallback(
    async (job) => {
      if (isSaved(job.id)) {
        setSaved((s) => s.filter((j) => j.id !== job.id)); // optimistic update
        await api.unsaveJob(job.id).catch(() => setSaved((s) => [job, ...s]));
      } else {
        setSaved((s) => [job, ...s]);
        await api.saveJob(job).catch(() => setSaved((s) => s.filter((j) => j.id !== job.id)));
      }
    },
    [isSaved]
  );

  return { saved, isSaved, toggle };
}
