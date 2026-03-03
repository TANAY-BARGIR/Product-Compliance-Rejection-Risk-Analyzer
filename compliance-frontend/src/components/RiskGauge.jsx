import './RiskGauge.css';

function RiskGauge({ score, level }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const offset = circumference - progress;

  let colorClass = 'gauge-low';
  if (score >= 100) colorClass = 'gauge-critical';
  else if (score >= 50) colorClass = 'gauge-high';
  else if (score > 0) colorClass = 'gauge-moderate';

  return (
    <div className={`risk-gauge ${colorClass}`}>
      <svg viewBox="0 0 128 128" className="gauge-svg">
        <circle
          cx="64" cy="64" r={radius}
          fill="none"
          stroke="var(--gauge-track)"
          strokeWidth="10"
        />
        <circle
          cx="64" cy="64" r={radius}
          fill="none"
          stroke="var(--gauge-color)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="gauge-progress"
          transform="rotate(-90 64 64)"
        />
      </svg>
      <div className="gauge-text">
        <span className="gauge-score">{score}</span>
        <span className="gauge-label">{level}</span>
      </div>
    </div>
  );
}

export default RiskGauge;
