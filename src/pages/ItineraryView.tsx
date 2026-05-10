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

export const ItineraryView: React.FC<{ onNav: (id: string) => void }> = ({ onNav }) => {
  return (
    <div className="main-content fade-up">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, gap: 16, flexWrap: 'wrap' }}>
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <span style={{ fontSize: 36 }}>🏛️</span>
          <div>
            <div className="page-title">European Summer</div>
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 4 }}>
              <span className="badge badge-green">Upcoming</span>
              <span style={{ fontSize: 13, color: "var(--text2)" }}>Jun 15 – Jul 3 · 19 days · 3 cities</span>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-secondary btn-sm" onClick={() => onNav("builder")}><Icon name="edit" size={13} /> Edit</button>
          <button className="btn btn-secondary btn-sm" onClick={() => onNav("shared")}><Icon name="share" size={13} /> Share</button>
        </div>
      </div>

      <div className="timeline">
        {ITINERARY.map((day, di) => (
          <div key={di} className="timeline-item fade-up" style={{ animationDelay: `${di * .08}s` }}>
            <div className="timeline-date">{day.date}</div>
            <div className="timeline-city">{day.city}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {day.activities.map((act, ai) => (
                <div key={ai} style={{ display: "flex", gap: 12, background: "var(--surface)", borderRadius: 10, padding: "10px 14px", border: "1px solid var(--border)" }}>
                  <div style={{ fontSize: 11, color: "var(--text3)", width: 40, flexShrink: 0, paddingTop: 2 }}>{act.time}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 500 }}>{act.name}</div>
                    <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                      <span className={`badge badge-${act.type === "travel" ? "blue" : act.type === "sightseeing" ? "green" : act.type === "food" ? "gold" : "gray"}`} style={{ fontSize: 10 }}>{act.type}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
