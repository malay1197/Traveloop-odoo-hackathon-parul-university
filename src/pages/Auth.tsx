import React, { useState } from 'react';
import { api } from '../services/api';
import { Icon } from '../components/Icon';

interface AuthProps {
  onLogin: (user: any, token: string) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [tab, setTab] = useState<'login' | 'signup'>("login");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      if (tab === 'login') {
        const res: any = await api.auth.login({ email, password: pass });
        onLogin(res.user, res.token);
      } else {
        const res: any = await api.auth.register({ name, email, password: pass });
        onLogin(res.user, res.token);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-wrap fade-in">
      <div className="auth-card fade-up">
        <div className="auth-logo">✈ Traveloop</div>
        <div className="auth-tagline">Plan your perfect journey</div>

        <div className="auth-tabs">
          <button className={`auth-tab${tab === "login" ? " active" : ""}`} onClick={() => setTab("login")}>Sign in</button>
          <button className={`auth-tab${tab === "signup" ? " active" : ""}`} onClick={() => setTab("signup")}>Create account</button>
        </div>

        <form onSubmit={handleSubmit}>
          {tab === "signup" && (
            <div className="form-group">
              <label className="form-label">Full name</label>
              <input className="form-input" placeholder="Jane Doe" value={name} onChange={e => setName(e.target.value)} required />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email address</label>
            <input className="form-input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Password</span>
              {tab === "login" && <span style={{ color: "var(--gold)", cursor: "pointer", fontWeight: 400 }}>Forgot?</span>}
            </label>
            <input className="form-input" type="password" placeholder="••••••••" value={pass} onChange={e => setPass(e.target.value)} required />
          </div>

          {error && <div style={{ color: 'var(--danger)', fontSize: 13, marginBottom: 16 }}>{error}</div>}

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: "100%", justifyContent: "center" }}>
            {tab === "login" ? "Sign in" : "Create account"}
            <Icon name="arrow" size={16} />
          </button>
        </form>

        <div className="auth-divider">or continue with</div>

        <button className="social-btn"><span style={{ fontSize: 18 }}>G</span> Google</button>
        <button className="social-btn"><span style={{ fontSize: 18 }}>🍎</span> Apple</button>

        {tab === "login" && (
          <div style={{ textAlign: "center", marginTop: 16, fontSize: 13, color: "var(--text3)" }}>
            Don't have an account?{" "}
            <span style={{ color: "var(--gold)", cursor: "pointer" }} onClick={() => setTab("signup")}>Sign up free</span>
          </div>
        )}
      </div>
    </div>
  );
};
