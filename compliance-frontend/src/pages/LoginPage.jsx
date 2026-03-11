import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../api';
import './AuthPage.css';

function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(form);
      onLogin(res.data.user);
      navigate('/evaluate');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Left Panel */}
      <div className="auth-left">
        <Link to="/" className="auth-brand">
          <div className="auth-brand-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 12l2 2 4-4" /><path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z" />
            </svg>
          </div>
          <span>ComplianceIQ</span>
        </Link>
        <div className="auth-left-content">
          <h1>Your pre-certification<br />compliance lab</h1>
          <p>Test products against BIS and FSSAI regulations before costly lab submissions.</p>
          <ul className="auth-features">
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              5-module lab-style compliance testing
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              Explainable risk scores with breakdown
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              AI-powered executive summary
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              PDF compliance certificate
            </li>
          </ul>
        </div>
        <div className="auth-left-circles">
          <div className="auth-circle c1" />
          <div className="auth-circle c2" />
        </div>
      </div>

      {/* Right Panel */}
      <div className="auth-right">
        <div className="auth-form-wrap">
          <div className="auth-form-header">
            <h2>Welcome back</h2>
            <p>Sign in to continue to your dashboard</p>
          </div>

          {error && (
            <div className="auth-error">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field">
              <label htmlFor="email">Email Address</label>
              <input id="email" name="email" type="email" placeholder="you@company.com" value={form.email} onChange={handleChange} required autoComplete="email" />
            </div>
            <div className="auth-field">
              <label htmlFor="password">Password</label>
              <input id="password" name="password" type="password" placeholder="••••••••" value={form.password} onChange={handleChange} required autoComplete="current-password" />
            </div>
            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? <><span className="auth-spinner" />Signing In...</> : 'Sign In'}
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account? <Link to="/signup">Create one →</Link>
          </p>
          <p className="auth-back"><Link to="/">← Back to Home</Link></p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
