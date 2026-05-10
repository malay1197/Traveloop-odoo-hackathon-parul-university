import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Icon } from '../components/Icon';
import { Trip } from '../types';

interface DashboardProps {
  onNav: (id: string) => void;
  user: any;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNav, user }) => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.trips.getAll()
      .then(setTrips)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="main-content fade-up">
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <div style={{ fontSize: 13, color: "var(--text3)", marginBottom: 4 }}>Good morning ☀️</div>
          <div className="page-title">Welcome back, {user?.name?.split(' ')[0]}</div>
          <div className="page-subtitle">You have {trips.filter(t => t.status !== 'completed').length} upcoming trips. Ready to explore?</div>
        </div>
        <button className="btn btn-primary" onClick={() => onNav("create")}>
          <Icon name="plus" size={15} /> Plan New Trip
        </button>
      </div>

      <div className="grid-4" style={{ marginBottom: 24 }}>
        {[
          { v: trips.length.toString(), l: "Total trips", c: "var(--gold)" },
          { v: trips.reduce((acc, t) => acc + (t.spent || 0), 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' }), l: "Total spent", c: "#cc6a4a" },
          { v: "12", l: "Cities visited", c: "#4a9ecc" },
          { v: "47", l: "Days traveled", c: "var(--green)" },
        ].map(s => (
          <div className="stat-box" key={s.l}>
            <div className="stat-box-value" style={{ color: s.c }}>{s.v}</div>
            <div className="stat-box-label">{s.l}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20, marginBottom: 24 }}>
        <div className="card">
          <div style={{ display: "flex", justifySelf: "space-between", justifyContent: 'space-between', alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontWeight: 600, fontSize: 15 }}>My Recent Trips</div>
            <button className="btn btn-ghost btn-sm" onClick={() => onNav("trips")}>View all →</button>
          </div>
          {loading ? <div>Loading...</div> : trips.slice(0, 3).map(trip => (
            <div key={trip.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
              <div style={{ fontSize: 28, width: 44, height: 44, background: 'var(--surface2)', borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>{trip.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, fontSize: 14 }}>{trip.name}</div>
                <div style={{ fontSize: 12, color: "var(--text3)" }}>{trip.start_date || 'Planning'}</div>
              </div>
              <span className={`badge badge-${trip.status === "upcoming" ? "green" : "gold"}`}>{trip.status}</span>
            </div>
          ))}
          {!loading && trips.length === 0 && <div style={{ color: 'var(--text3)', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>No trips planned yet.</div>}
        </div>

        <div className="card">
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>Quick Actions</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              { label: "Search Cities", icon: "search", page: "cities", color: "rgba(200,181,96,.1)" },
              { label: "Find Activities", icon: "activity", page: "activities", color: "rgba(109,179,109,.1)" },
              { label: "View Budget", icon: "budget", page: "budget", color: "rgba(74,158,200,.1)" },
              { label: "Packing List", icon: "pack", page: "packing", color: "rgba(200,106,74,.1)" },
            ].map(a => (
              <button key={a.label} className="btn btn-secondary" style={{ background: a.color, border: "1px solid var(--border)", flexDirection: "column", gap: 6, padding: "16px 12px", height: "auto", borderRadius: 12 }} onClick={() => onNav(a.page)}>
                <Icon name={a.icon} size={20} />
                <span style={{ fontSize: 12 }}>{a.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
