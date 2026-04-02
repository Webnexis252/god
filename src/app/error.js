"use client";

export default function Error({ reset }) {
  return (
    <main className="system-screen">
      <div className="system-card">
        <p className="section-eyebrow">Something broke</p>
        <h1 className="system-title">The page hit an unexpected error.</h1>
        <p className="system-copy">
          Try the reload action below. If the problem keeps showing up, the
          broken state is now isolated instead of taking down the entire route.
        </p>
        <button className="primary-button" type="button" onClick={() => reset()}>
          Try again
        </button>
      </div>
    </main>
  );
}
