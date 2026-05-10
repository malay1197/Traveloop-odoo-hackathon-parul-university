import React, { useState } from 'react';
import { Icon } from '../components/Icon';

const ITINERARY = [
  { day: 1, date: "Jun 15", city: "Paris", activities: [
    { time: "09:00", name: "Arrive CDG, hotel check-in", type: "travel", cost: 0 },
    { time: "14:00", name: "Eiffel Tower Visit", type: "sightseeing", cost: 35 },
    { time: "19:00", name: "Dinner at Le Marais", type: "food", cost: 65 },
  ]},
  { day: 2, date: "Jun 16", city: "Paris", activities: [
    { time: "09:30", name: "Louvre Museum", type: "culture", cost: 22 },
    { time: "14:00", name: "Palais Royal gardens", type: "sightseeing", cost: 0 },
    { time: "20:00", name: "Seine River Cruise", type: "experience", cost: 18 },
  ]},
];

export const ItineraryBuilder: React.FC<{ onNav: (id: string) => void }> = ({ onNav }) => {
  const [activeDay, setActiveDay] = useState(0);
  const day = ITINERARY[activeDay] || ITINERARY[0];

  return (
    <div className="main-content fade-up">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, gap: 16, flexWrap: 'wrap' }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <span style={{ fontSize: 28 }}>🏛️</span>
            <div className="page-title">European Summer</div>
          </div>
          <div className="page-subtitle">Jun 15 – Jul 3, 2025 · Paris → Rome → Barcelona</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-secondary" onClick={() => onNav("itinerary")}><Icon name="view" size={14} /> Preview</button>
          <button className="btn btn-primary"><Icon name="check" size={14} /> Save</button>
        </div>
      </div>

      <div className="builder-layout" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text3)", marginBottom: 10, letterSpacing: ".05em", textTransform: "uppercase" }}>Days</div>
          {ITINERARY.map((d, i) => (
            <button key={i} onClick={() => setActiveDay(i)} style={{
              width: "100%", textAlign: "left", padding: "10px 12px", borderRadius: 10,
              background: activeDay === i ? "var(--surface2)" : "none",
              border: `1px solid ${activeDay === i ? "var(--border2)" : "transparent"}`,
              color: activeDay === i ? "var(--gold)" : "var(--text2)", marginBottom: 4,
              display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all .2s"
            }}>
              <div>
                <div style={{ fontWeight: 500, fontSize: 13 }}>Day {d.day}</div>
                <div style={{ fontSize: 11, color: "var(--text3)" }}>{d.date} · {d.city}</div>
              </div>
              <span style={{ fontSize: 11, color: "var(--text3)" }}>{d.activities.length} stops</span>
            </button>
          ))}
        </div>

        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, gap: 10, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 16 }}>Day {day.day} — {day.city}</div>
              <div style={{ fontSize: 13, color: "var(--text3)" }}>{day.date}</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-secondary btn-sm"><Icon name="map" size={13} /> City</button>
              <button className="btn btn-secondary btn-sm"><Icon name="plus" size={13} /> Activity</button>
            </div>
          </div>

          {day.activities.map((act, i) => (
            <div key={i} style={{ display: "flex", gap: 14, padding: "14px 0", borderBottom: "1px solid var(--border)" }}>
              <div style={{ fontSize: 12, color: "var(--text3)", width: 46, textAlign: "right", paddingTop: 2, flexShrink: 0 }}>{act.time}</div>
              <div style={{ width: 2, background: "var(--border)", borderRadius: 2, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 3 }}>{act.name}</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <span className={`badge badge-${act.type === "travel" ? "blue" : act.type === "sightseeing" ? "green" : act.type === "food" ? "gold" : "gray"}`} style={{ fontSize: 10 }}>{act.type}</span>
                  {act.cost > 0 && <span style={{ fontSize: 12, color: "var(--text3)" }}>${act.cost}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
