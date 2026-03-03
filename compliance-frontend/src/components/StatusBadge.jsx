import './StatusBadge.css';

const STATUS_MAP = {
  COMPLIANT: { label: 'Compliant', className: 'badge-success' },
  'NON-COMPLIANT': { label: 'Non-Compliant', className: 'badge-danger' },
  BORDERLINE: { label: 'Borderline', className: 'badge-warning' },
  NOT_EVALUATED: { label: 'Not Evaluated', className: 'badge-info' },
};

function StatusBadge({ status, size = 'md' }) {
  const config = STATUS_MAP[status] || { label: status, className: 'badge-info' };

  return (
    <span className={`status-badge ${config.className} badge-${size}`}>
      <span className="badge-dot"></span>
      {config.label}
    </span>
  );
}

export default StatusBadge;
