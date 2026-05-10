import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Icon } from '../components/Icon';
import { Trip } from '../types';

interface MyTripsProps {
  onNav: (id: string) => void;
}

export const MyTrips: React.FC<MyTripsProps> = ({ onNav }) => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.trips.getAll()
      .then(setTrips)
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "all" ? trips : trips.filter(t => t.status === filter);

  return (
    <div className="main-content fade-up">
      <div className="page-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div className="page-title">My Trips</div>
            <div className="page-subtitle">{trips.length} trips · {trips.filter(t => t.status === "upcoming").length} upcoming</div>
          </div>
          <button className="btn btn-primary" onClick={() => onNav("create")}>
            <Icon name="plus" size={15} /> New Trip
          </button>
        </div>
      </div>

      <div className="filter-row">
        {["all", "upcoming", "planning", "completed"].map(f => (
          <button key={f} className={`tag${filter === f ? " active" : ""}`} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid-3">
        {loading ? <div>Loading trips...</div> : filtered.map(trip => (
          <div key={trip.id} className="trip-card" onClick={() => onNav("itinerary")}>
            <div className="trip-card-img" style={{ background: 'var(--surface2)' }}>
              <span style={{ fontSize: 56 }}>{trip.emoji}</span>
            </div>
            <div className="trip-card-body">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                <div className="trip-card-title">{trip.name}</div>
                <span className={`badge badge-${trip.status === "upcoming" ? "green" : trip.status === "completed" ? "gray" : "gold"}`} style={{ fontSize: 10, padding: "2px 8px" }}>
                  {trip.status}
                </span>
              </div>
              <div className="trip-card-meta" style={{ marginBottom: 10 }}>
                <Icon name="trips" size={12} />
                {trip.start_date || 'No date set'}
              </div>
              <div className="progress">
                <div className="progress-fill" style={{ width: `${(trip.spent / trip.budget) * 100}%`, background: `linear-gradient(90deg,var(--gold),var(--green))` }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 11, color: "var(--text3)" }}>
                <span>${trip.spent?.toLocaleString() || 0} spent</span>
                <span>${trip.budget?.toLocaleString() || 0} budget</span>
              </div>
            </div>
          </div>
        ))}
        {!loading && filtered.length === 0 && (
          <div style={{ border: "1.5px dashed var(--border)", borderRadius: "var(--radius-lg)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, minHeight: 240, cursor: "pointer", transition: "border-color .2s" }} onClick={() => onNav("create")}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--surface)", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="plus" size={20} /></div>
            <span style={{ fontSize: 13.5, color: "var(--text2)" }}>Create new trip</span>
          </div>
        )}
      </div>
    </div>
  );
};
