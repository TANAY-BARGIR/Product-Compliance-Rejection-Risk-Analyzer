const API_BASE = 'http://localhost:3000/api';

// ── Auth ──────────────────────────────────────────────────────

export async function signup(data) {
  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Signup failed');
  return json;
}

export async function login(data) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Login failed');
  return json;
}

// ── Evaluation ───────────────────────────────────────────────

export async function evaluateProduct(data) {
  const res = await fetch(`${API_BASE}/evaluate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Network error' }));
    throw new Error(err.message || `Server error: ${res.status}`);
  }

  return res.json();
}

export async function downloadReport(data) {
  const res = await fetch(`${API_BASE}/report`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('Failed to generate report');
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `compliance_report_${Date.now()}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function getHistory() {
  const res = await fetch(`${API_BASE}/history`);
  if (!res.ok) throw new Error('Failed to fetch history');
  return res.json();
}

export async function getEvaluationDetail(id) {
  const res = await fetch(`${API_BASE}/evaluations/${id}`);
  if (!res.ok) throw new Error('Failed to fetch evaluation detail');
  return res.json();
}
