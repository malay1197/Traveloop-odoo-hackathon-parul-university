import React, { useState } from 'react';
import { Icon } from '../components/Icon';

const PACKING = {
  "Clothing": ["T-shirts", "Jeans", "Walking shoes"],
  "Docs": ["Passport", "Tickets", "Insurance"],
  "Electronics": ["Charger", "Power bank"],
};

export const PackingChecklist: React.FC = () => {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const toggle = (item: string) => setChecked(prev => ({ ...prev, [item]: !prev[item] }));

  return (
    <div className="main-content fade-up">
      <div className="page-header">
        <div className="page-title">Packing Checklist</div>
        <div className="page-subtitle">Don't forget anything!</div>
      </div>

      <div className="grid-responsive" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
        {Object.entries(PACKING).map(([cat, items]) => (
          <div key={cat} className="card">
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 12 }}>{cat}</div>
            {items.map(item => (
              <div key={item} className="checkbox-item" onClick={() => toggle(item)} style={{ cursor: 'pointer' }}>
                <div className={`checkbox ${checked[item] ? 'checked' : ''}`} style={{ width: 18, height: 18, borderRadius: 4, border: '1px solid var(--border)', marginRight: 10, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', verticalAlign: 'middle' }}>
                  {checked[item] && <Icon name="check" size={12} />}
                </div>
                <span style={{ textDecoration: checked[item] ? 'line-through' : 'none', color: checked[item] ? 'var(--text3)' : 'var(--text)' }}>{item}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
