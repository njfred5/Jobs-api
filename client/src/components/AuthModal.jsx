import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function AuthModal({ onClose }) {
  const { authenticate } = useAuth();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await authenticate(mode, form);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="overlay" onClick={onClose}>
      <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <h2>{mode === "login" ? "Welcome back" : "Create your account"}</h2>

        {mode === "register" && (
          <input placeholder="Name" value={form.name} onChange={set("name")} required autoFocus />
        )}
        <input type="email" placeholder="Email" value={form.email} onChange={set("email")} required autoFocus={mode === "login"} />
        <input type="password" placeholder="Password (8+ characters)" value={form.password} onChange={set("password")} required minLength={8} />

        {error && <p className="error">{error}</p>}

        <button className="btn" disabled={busy}>{busy ? "Please wait…" : mode === "login" ? "Log in" : "Sign up"}</button>
        <button type="button" className="link" onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}>
          {mode === "login" ? "No account? Sign up" : "Already registered? Log in"}
        </button>
      </form>
    </div>
  );
}
