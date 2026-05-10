import React, { useState } from 'react';
import { Icon } from '../components/Icon';

const ACTIVITIES = [
  { name: "Eiffel Tower Visit", city: "Paris", cat: "Sightseeing", cost: 35, dur: "3h", emoji: "🗼", rating: 4.8 },
  { name: "Louvre Museum", city: "Paris", cat: "Culture", cost: 22, dur: "4h", emoji: "🖼️", rating: 4.9 },
  { name: "Tsukiji Market Tour", city: "Tokyo", cat: "Food", cost: 45, dur: "3h", emoji: "🍣", rating: 4.9 },
];

export const ActivitySearch: React.FC = () => {
  const [q, setQ] = useState("");
  const filtered = ACTIVITIES.filter(a => a.name.toLowerCase().includes(q.toLowerCase()) || a.city.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="main-content fade-up">
      <div className="page-header">
        <div className="page-title">Activity Search</div>
        <div className="page-subtitle">Find and add experiences to your trip</div>
      </div>

      <div style={{ position: "relative", marginBottom: 16 }}>
        <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text3)" }}><Icon name="search" size={16} /></div>
        <input className="form-input" style={{ paddingLeft: 38 }} placeholder="Search activities..." value={q} onChange={e => setQ(e.target.value)} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 12 }}>
        {filtered.map(act => (
          <div key={act.name} className="card" style={{ display: "flex", gap: 14 }}>
            <div style={{ width: 52, height: 52, borderRadius: 12, background: "var(--bg3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>{act.emoji}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 2 }}>{act.name}</div>
              <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 6 }}>{act.city} · {act.dur}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span className="badge badge-gray" style={{ fontSize: 10 }}>{act.cat}</span>
                <span style={{ fontSize: 12, color: act.cost === 0 ? "var(--green)" : "var(--text2)" }}>${act.cost}</span>
              </div>
            </div>
            <button className="btn btn-primary btn-sm" style={{ alignSelf: 'flex-start' }}>Add</button>
          </div>
        ))}
      </div>
    </div>
  );
};
