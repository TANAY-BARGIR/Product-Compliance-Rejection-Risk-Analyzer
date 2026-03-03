import './ViolationCard.css';

function ViolationCard({ violation, type = 'violation' }) {
  const isViolation = type === 'violation';

  return (
    <div className={`violation-card ${isViolation ? 'vc-danger' : 'vc-warning'} animate-fade-in`}>
      <div className="vc-header">
        <div className="vc-icon">
          {isViolation ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          )}
        </div>
        <div className="vc-title-group">
          <span className="vc-rule-id">{violation.rule_id}</span>
          <h4 className="vc-title">{violation.rule_name}</h4>
        </div>
        {violation.severity && (
          <span className={`vc-severity ${violation.severity === 'CRITICAL' ? 'sev-critical' : 'sev-warning'}`}>
            {violation.severity}
          </span>
        )}
      </div>
      <p className="vc-description">{violation.description}</p>
      <div className="vc-details">
        <div className="vc-detail">
          <span className="vc-detail-label">Limit</span>
          <span className="vc-detail-value">{violation.limit_readable}</span>
        </div>
        <div className="vc-detail">
          <span className="vc-detail-label">Actual</span>
          <span className="vc-detail-value">{violation.actual_percent}</span>
        </div>
        {violation.warning && (
          <div className="vc-detail" style={{ flex: 2 }}>
            <span className="vc-detail-label">Note</span>
            <span className="vc-detail-value vc-warning-text">{violation.warning}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViolationCard;
