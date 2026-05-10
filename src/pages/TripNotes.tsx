import React, { useState } from 'react';
import { Icon } from '../components/Icon';

const NOTES = [
  { id: 1, title: "Paris restaurant recs", city: "Paris", content: "Le Comptoir du Relais – must book ahead. Frenchie for brunch." },
  { id: 2, title: "Rome metro tips", city: "Rome", content: "Day pass is worth it. Avoid the A line at rush hour." },
];

export const TripNotes: React.FC = () => {
  const [notes, setNotes] = useState(NOTES);
  const [active, setActive] = useState(0);
  const [isCreating, setIsCreating] = useState(false);
  const [draft, setDraft] = useState({ title: "", city: "", content: "" });

  const handleSave = () => {
    if (draft.title && draft.content) {
      const newNote = { id: Date.now(), ...draft };
      const updatedNotes = [newNote, ...notes];
      setNotes(updatedNotes);
      setActive(0);
      setIsCreating(false);
      setDraft({ title: "", city: "", content: "" });
    }
  };

  return (
    <div className="main-content fade-up">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="page-title">Trip Notes</div>
            <div className="page-subtitle">{notes.length} research and reminders</div>
          </div>
          {isCreating && (
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-secondary btn-sm" onClick={() => setIsCreating(false)}>Cancel</button>
              <button className="btn btn-primary btn-sm" onClick={handleSave}>Save Note</button>
            </div>
          )}
        </div>
      </div>

      <div className="notes-layout" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {notes.map((note, i) => (
            <div key={note.id} className="card" onClick={() => { setActive(i); setIsCreating(false); }} style={{ borderLeft: (!isCreating && active === i) ? '4px solid var(--gold)' : 'none', cursor: 'pointer' }}>
              <div style={{ fontWeight: 600 }}>{note.title}</div>
              <div style={{ fontSize: 12, color: 'var(--text3)' }}>{note.city}</div>
            </div>
          ))}
          <button className="btn btn-secondary w-full justify-center" onClick={() => setIsCreating(true)}>+ New Note</button>
        </div>

        <div className="card">
          {isCreating ? (
            <div className="fade-in">
              <div className="form-group">
                <label className="form-label">Note Title</label>
                <input 
                  className="form-input" 
                  placeholder="e.g. Best Gelato in Rome" 
                  value={draft.title} 
                  onChange={e => setDraft({ ...draft, title: e.target.value })} 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Location / City</label>
                <input 
                  className="form-input" 
                  placeholder="e.g. Rome" 
                  value={draft.city} 
                  onChange={e => setDraft({ ...draft, city: e.target.value })} 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Content</label>
                <textarea 
                  className="form-input" 
                  style={{ minHeight: 200 }} 
                  placeholder="Write your research or reminder here..." 
                  value={draft.content} 
                  onChange={e => setDraft({ ...draft, content: e.target.value })} 
                />
              </div>
            </div>
          ) : notes[active] ? (
            <div className="fade-in">
              <div className="page-title" style={{ fontSize: 20 }}>{notes[active].title}</div>
              <div style={{ fontSize: 14, color: 'var(--gold)', marginBottom: 16 }}>{notes[active].city}</div>
              <div style={{ lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{notes[active].content}</div>
            </div>
          ) : (
            <div className="empty">Select a note or create a new one.</div>
          )}
        </div>
      </div>
    </div>
  );
};
