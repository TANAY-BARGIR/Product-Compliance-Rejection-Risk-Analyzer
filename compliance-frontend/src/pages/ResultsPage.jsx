import { useNavigate } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';
import RiskGauge from '../components/RiskGauge';
import ViolationCard from '../components/ViolationCard';
import { downloadReport } from '../api';
import { useState } from 'react';
import './ResultsPage.css';

function ResultsPage({ result, request }) {
  const navigate = useNavigate();
  const [downloading, setDownloading] = useState(false);

  if (!result || !result.data) {
    return (
      <div className="page-container">
        <div className="empty-state card animate-fade-in">
          <div className="empty-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <h2>No Results Yet</h2>
          <p>Submit a product for evaluation to see the compliance report here.</p>
          <button className="btn btn-primary mt-2" onClick={() => navigate('/')}>
            Go to Evaluation
          </button>
        </div>
      </div>
    );
  }

  const { data } = result;
  const report = data.compliance_report;

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadReport(request);
    } catch (err) {
      alert('Failed to download report: ' + err.message);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="results-header animate-fade-in">
        <div>
          <h1>{data.product}</h1>
          <p className="results-category">{data.category.charAt(0).toUpperCase() + data.category.slice(1)} — {report.standard}</p>
        </div>
        <StatusBadge status={report.status} size="lg" />
      </div>

      {/* Overview cards */}
      <div className="overview-grid stagger">
        {/* Risk Score */}
        <div className="card overview-card animate-fade-in-up">
          <h3 className="oc-label">Rejection Risk Score</h3>
          <div className="oc-gauge-container">
            <RiskGauge score={report.risk_score} level={report.risk_level} />
          </div>
          {report.primary_reasons && report.primary_reasons.length > 0 && (
            <div className="oc-reasons">
              {report.primary_reasons.map((r, i) => (
                <span key={i} className="oc-reason-tag">{r}</span>
              ))}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="card overview-card animate-fade-in-up">
          <h3 className="oc-label">Evaluation Summary</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-value stat-danger">{report.total_violations}</span>
              <span className="stat-label">Violations</span>
            </div>
            <div className="stat-item">
              <span className="stat-value stat-warning">{report.total_borderlines}</span>
              <span className="stat-label">Borderlines</span>
            </div>
            <div className="stat-item">
              <span className="stat-value stat-info">{report.missing_data_count}</span>
              <span className="stat-label">Unknown</span>
            </div>
            <div className="stat-item">
              <span className="stat-value stat-success">{data.normalization_summary.resolved_count}</span>
              <span className="stat-label">Resolved</span>
            </div>
          </div>

          {data.normalization_summary.unknown_list.length > 0 && (
            <div className="unknown-list mt-2">
              <span className="unknown-label">Unidentified ingredients:</span>
              {data.normalization_summary.unknown_list.map((name, i) => (
                <span key={i} className="unknown-tag">{name}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Violations */}
      {report.violations && report.violations.length > 0 && (
        <div className="results-section animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <h2 className="results-section-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
            </svg>
            Violations ({report.violations.length})
          </h2>
          <div className="violations-list stagger">
            {report.violations.map((v, i) => (
              <ViolationCard key={i} violation={v} type="violation" />
            ))}
          </div>
        </div>
      )}

      {/* Borderlines */}
      {report.borderlines && report.borderlines.length > 0 && (
        <div className="results-section animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <h2 className="results-section-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--warning)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            Borderline Warnings ({report.borderlines.length})
          </h2>
          <div className="violations-list stagger">
            {report.borderlines.map((b, i) => (
              <ViolationCard key={i} violation={b} type="borderline" />
            ))}
          </div>
        </div>
      )}

      {/* AI Explanation */}
      {report.ai_explanation && (
        <div className="card results-section ai-section animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          <h2 className="results-section-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a4 4 0 0 1 4 4c0 1.95-1.4 3.57-3.25 3.92L12 10v2" /><circle cx="12" cy="16" r="1" /><circle cx="12" cy="12" r="10" />
            </svg>
            AI Analysis
          </h2>
          <p className="ai-text">{report.ai_explanation}</p>
        </div>
      )}

      {/* Actions */}
      <div className="results-actions animate-fade-in-up" style={{ animationDelay: '500ms' }}>
        <button className="btn btn-primary btn-lg" onClick={handleDownload} disabled={downloading}>
          {downloading ? (
            <>
              <span className="spinner"></span>
              Generating PDF...
            </>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download PDF Report
            </>
          )}
        </button>
        <button className="btn btn-secondary btn-lg" onClick={() => navigate('/')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Evaluation
        </button>
      </div>
    </div>
  );
}

export default ResultsPage;
