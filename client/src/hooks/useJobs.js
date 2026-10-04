import { useEffect, useState } from "react";
import { api } from "../api.js";

// Fetches jobs whenever the filters change, cancelling outdated requests.
export function useJobs(filters) {
  const [state, setState] = useState({ jobs: [], loading: true, error: null });
  const key = JSON.stringify(filters);

  useEffect(() => {
    const controller = new AbortController();
    setState((s) => ({ ...s, loading: true, error: null }));

    const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
    api.jobs(params, controller.signal)
      .then((d) => setState({ jobs: d.jobs, loading: false, error: null }))
      .catch((e) => {
        if (e.name !== "AbortError") setState({ jobs: [], loading: false, error: e.message });
      });

    return () => controller.abort();
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps

  return state;
}
