export default function Loading({ label = "Loading", full = true }) {
  if (full) {
    return (
      <div className="loading-screen">
        <div className="loading-card">
          <span className="spinner" aria-hidden="true" />
          <div>
            <h2>OpsFlow</h2>
            <p className="muted">{label}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="loading">
      <span className="spinner" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
