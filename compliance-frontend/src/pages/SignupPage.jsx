import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../api';
import './AuthPage.css';

function SignupPage({ onLogin }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const res = await signup({ name: form.name, email: form.email, password: form.password });
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
          <h1>Start testing compliance<br />in minutes</h1>
          <p>Create your account and run your first compliance evaluation immediately.</p>
          <ul className="auth-features">
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              Instant ingredient alias resolution
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              Ingredient interaction detection
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              Full evaluation history & audit trail
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              Downloadable PDF compliance reports
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
            <h2>Create your account</h2>
            <p>Start your compliance journey today</p>
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
              <label htmlFor="name">Full Name</label>
              <input id="name" name="name" type="text" placeholder="Dr. Jane Smith" value={form.name} onChange={handleChange} required autoComplete="name" />
            </div>
            <div className="auth-field">
              <label htmlFor="email">Email Address</label>
              <input id="email" name="email" type="email" placeholder="you@company.com" value={form.email} onChange={handleChange} required autoComplete="email" />
            </div>
            <div className="auth-field">
              <label htmlFor="password">Password</label>
              <input id="password" name="password" type="password" placeholder="Min. 6 characters" value={form.password} onChange={handleChange} required autoComplete="new-password" />
            </div>
            <div className="auth-field">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input id="confirmPassword" name="confirmPassword" type="password" placeholder="••••••••" value={form.confirmPassword} onChange={handleChange} required autoComplete="new-password" />
            </div>
            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? <><span className="auth-spinner" />Creating Account...</> : 'Create Account'}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign In →</Link>
          </p>
          <p className="auth-back"><Link to="/">← Back to Home</Link></p>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
