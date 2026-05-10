import React from 'react';
import { Icon } from '../components/Icon';

export const SharedItinerary: React.FC = () => {
  return (
    <div className="main-content fade-up">
      <div className="card" style={{ background: "linear-gradient(135deg,#1a2a1a,#0a1a0a)", marginBottom: 24 }}>
        <div style={{ fontSize: 13, color: "var(--text3)", letterSpacing: ".08em", textTransform: "uppercase" }}>Public Itinerary</div>
        <div className="page-title" style={{ marginTop: 8 }}>🏛️ European Summer</div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
          <span className="badge badge-green">19 days</span>
          <span className="badge badge-gold">3 cities</span>
        </div>
      </div>

      <div className="card">
        <div style={{ fontWeight: 500, fontSize: 13, marginBottom: 8 }}>Share this itinerary</div>
        <div style={{ display: "flex", gap: 8, flexWrap: 'wrap' }}>
          <input className="form-input" value="https://traveloop.app/share/european-summer-jane" readOnly style={{ flex: 1, minWidth: 200 }} />
          <button className="btn btn-primary"><Icon name="copy" size={13} /> Copy Link</button>
        </div>
      </div>
    </div>
  );
};