import { useEffect, useState } from 'react';
import StatusBadge from '../components/StatusBadge';
import { getHistory } from '../api';
import './HistoryPage.css';

function HistoryPage() {
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await getHistory();
      setEvaluations(res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="page-container">
      <div className="history-header animate-fade-in">
        <div className="hero-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>
        <div>
          <h1>Evaluation History</h1>
          <p>Browse past compliance evaluations and their results.</p>
        </div>
      </div>

      {loading ? (
        <div className="history-loading">
          <span className="spinner spinner-dark" style={{ width: 28, height: 28 }}></span>
          <p>Loading history...</p>
        </div>
      ) : error ? (
        <div className="error-banner animate-fade-in">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </div>
      ) : evaluations.length === 0 ? (
        <div className="card empty-state animate-fade-in">
          <div className="empty-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" />
            </svg>
          </div>
          <h2>No Evaluations Yet</h2>
          <p>Evaluate a product to see its results appear here.</p>
        </div>
      ) : (
        <div className="history-table-wrap card animate-fade-in-up">
          <table className="history-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Status</th>
                <th>Risk</th>
                <th>Violations</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {evaluations.map((ev, i) => (
                <tr key={ev.id || i} className="animate-fade-in" style={{ animationDelay: `${i * 40}ms` }}>
                  <td className="td-product">{ev.product_name}</td>
                  <td className="td-category">{ev.category}</td>
                  <td><StatusBadge status={ev.status} size="sm" /></td>
                  <td>
                    <span className={`risk-pill risk-${ev.risk_score >= 100 ? 'critical' : ev.risk_score >= 50 ? 'high' : ev.risk_score > 0 ? 'moderate' : 'low'}`}>
                      {ev.risk_score}
                    </span>
                  </td>
                  <td className="td-violations">{ev.total_violations}</td>
                  <td className="td-date">{formatDate(ev.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default HistoryPage;
