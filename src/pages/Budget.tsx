import React from 'react';

const BUDGET_ITEMS = [
  { cat: "Flights", spent: 1200, budget: 1300, color: "#c8b560", emoji: "✈️" },
  { cat: "Hotels", spent: 680, budget: 800, color: "#6db36d", emoji: "🏨" },
  { cat: "Food", spent: 280, budget: 350, color: "#9e6a4a", emoji: "🍽️" },
];

export const Budget: React.FC = () => {
  const total = BUDGET_ITEMS.reduce((s, i) => s + i.budget, 0);
  const spent = BUDGET_ITEMS.reduce((s, i) => s + i.spent, 0);
  const pct = Math.round((spent / total) * 100);

  return (
    <div className="main-content fade-up">
      <div className="page-header">
        <div className="page-title">Budget & Costs</div>
        <div className="page-subtitle">European Summer · Jun 15 – Jul 3</div>
      </div>

      <div className="grid-responsive" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
        <div className="card">
          <div style={{ textAlign: "center", padding: "8px 0" }}>
            <div style={{ fontSize: 26, color: "var(--gold)", fontWeight: 600 }}>${spent.toLocaleString()}</div>
            <div style={{ fontSize: 12, color: "var(--text3)" }}>of ${total.toLocaleString()} total budget ({pct}%)</div>
            <div className="progress" style={{ marginTop: 16 }}>
              <div className="progress-fill" style={{ width: `${pct}%`, background: "var(--gold)" }} />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {BUDGET_ITEMS.map(item => (
            <div key={item.cat} className="card" style={{ padding: '12px 16px' }}>
              <div style={{ display: "flex", justifyContent: 'space-between', alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontWeight: 500 }}>{item.emoji} {item.cat}</span>
                <span style={{ fontSize: 14 }}>${item.spent} / ${item.budget}</span>
              </div>
              <div className="progress">
                <div className="progress-fill" style={{ width: `${(item.spent / item.budget) * 100}%`, background: item.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
