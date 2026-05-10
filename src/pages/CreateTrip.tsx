import React, { useState } from 'react';
import { Icon } from '../components/Icon';
import { api } from '../services/api';

interface CreateTripProps {
  onNav: (id: string) => void;
}

const COMMON_CITIES = ["Paris", "Tokyo", "London", "New York", "Rome", "Bali", "Sydney", "Barcelona"];

export const CreateTrip: React.FC<CreateTripProps> = ({ onNav }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ 
    name: "", 
    desc: "", 
    start: "", 
    end: "", 
    emoji: "🌍",
    budget: "$$",
    style: "Comfort",
    interests: [] as string[]
  });
  const [destinations, setDestinations] = useState<string[]>([]);
  const [cityInput, setCityInput] = useState("");

  const emojis = ["🌍", "🏔️", "🏖️", "🗼", "🏛️", "🌺", "🗾", "🏕️", "🌊", "🏙️", "🌴", "❄️"];
  const styles = ["Budget", "Comfort", "Luxury"];
  const budgets = ["$", "$$", "$$$", "$$$$"];
  const interestsList = ["Food & Dining", "Culture & Arts", "Active & Nature", "Nightlife", "Shopping", "Relaxation"];

  const upd = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  const toggleInterest = (interest: string) => {
    const next = form.interests.includes(interest)
      ? form.interests.filter(i => i !== interest)
      : [...form.interests, interest];
    upd("interests", next);
  };

  const addCity = (city: string) => {
    if (city && !destinations.includes(city)) {
      setDestinations([...destinations, city]);
      setCityInput("");
    }
  };

  const removeCity = (city: string) => {
    setDestinations(destinations.filter(c => c !== city));
  };

  const handleSubmit = async () => {
    console.log("Submitting trip form...", form);
    setLoading(true);
    try {
      const result = await api.trips.create({
        name: form.name,
        description: `${form.desc}\n\nDestinations: ${destinations.join(', ')}\nInterests: ${form.interests.join(', ')}\nStyle: ${form.style}`,
        start_date: form.start || null,
        end_date: form.end || null,
        emoji: form.emoji,
        budget: form.budget === "$" ? 1000 : form.budget === "$$" ? 3000 : form.budget === "$$$" ? 5000 : 10000,
      });
      console.log("Trip creation successful:", result);
      onNav("trips");
    } catch (error: any) {
      console.error("Failed to create trip:", error);
      alert(`Failed to create trip: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content fade-up">
      <div className="page-header">
        <div className="page-title">Create a New Trip</div>
        <div className="page-subtitle">Let's plan your next adventure</div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 32, maxWidth: 600, overflowX: 'auto', paddingBottom: 10 }}>
        {["Trip basics", "Destinations", "Preferences"].map((s, i) => (
          <React.Fragment key={s}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flexShrink: 0 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifySelf: "center", justifyContent: "center", background: step > i ? "var(--gold)" : step === i + 1 ? "var(--surface)" : "var(--surface)", border: `2px solid ${step > i ? "var(--gold)" : step === i + 1 ? "var(--gold)" : "var(--border)"}`, color: step > i ? "var(--bg)" : step === i + 1 ? "var(--gold)" : "var(--text3)", fontWeight: 600, fontSize: 13 }}>
                {step > i ? "✓" : i + 1}
              </div>
              <span style={{ fontSize: 11, color: step === i + 1 ? "var(--gold)" : "var(--text3)", whiteSpace: "nowrap" }}>{s}</span>
            </div>
            {i < 2 && <div style={{ flex: 1, minWidth: 20, height: 2, background: step > i + 1 ? "var(--gold)" : "var(--border)", margin: "0 8px", marginBottom: 18 }} />}
          </React.Fragment>
        ))}
      </div>

      <div style={{ maxWidth: 560 }}>
        {step === 1 && (
          <div className="card fade-in">
            <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 20 }}>Tell us about your trip</div>
            <div className="form-group">
              <label className="form-label">Trip icon</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {emojis.map(e => (
                  <button key={e} style={{ width: 40, height: 40, borderRadius: 10, border: `2px solid ${form.emoji === e ? "var(--gold)" : "var(--border)"}`, background: form.emoji === e ? "rgba(200,181,96,.1)" : "var(--bg3)", fontSize: 20, cursor: "pointer", transition: "all .2s" }} onClick={() => upd("emoji", e)}>{e}</button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Trip name *</label>
              <input className="form-input" placeholder="e.g. European Summer 2025" value={form.name} onChange={e => upd("name", e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-input" placeholder="What's the vibe of this trip?" value={form.desc} onChange={e => upd("desc", e.target.value)} />
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Start date</label>
                <input className="form-input" type="date" value={form.start} onChange={e => upd("start", e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">End date</label>
                <input className="form-input" type="date" value={form.end} onChange={e => upd("end", e.target.value)} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn btn-secondary" onClick={() => onNav("trips")}>Cancel</button>
              <button className="btn btn-primary" onClick={() => setStep(2)} disabled={!form.name}>
                Next: Add destinations <Icon name="arrow" size={15} />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="card fade-in">
            <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 20 }}>Where are you going?</div>
            <div className="form-group">
              <label className="form-label">Add a city</label>
              <div style={{ display: "flex", gap: 8 }}>
                <input 
                  className="form-input" 
                  placeholder="e.g. Kyoto, Japan" 
                  value={cityInput} 
                  onChange={e => setCityInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addCity(cityInput)}
                />
                <button className="btn btn-secondary" onClick={() => addCity(cityInput)}>Add</button>
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 8 }}>Suggested Cities</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {COMMON_CITIES.map(c => (
                  <button 
                    key={c} 
                    className="badge badge-gray" 
                    style={{ cursor: 'pointer', border: 'none', padding: '6px 12px' }}
                    onClick={() => addCity(c)}
                  >
                    + {c}
                  </button>
                ))}
              </div>
            </div>

            {destinations.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 12 }}>Selected Destinations</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {destinations.map((city, idx) => (
                    <div key={city} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'var(--surface2)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--gold)', color: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>{idx + 1}</div>
                        <span style={{ fontWeight: 500 }}>{city}</span>
                      </div>
                      <button style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer' }} onClick={() => removeCity(city)}>
                        <Icon name="trash" size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn btn-secondary" onClick={() => setStep(1)}>Back</button>
              <button className="btn btn-primary" onClick={() => setStep(3)} disabled={destinations.length === 0}>
                Next: Preferences <Icon name="arrow" size={15} />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="card fade-in">
            <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 20 }}>Travel Preferences</div>
            
            <div className="form-group">
              <label className="form-label">Budget Level</label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                {budgets.map(b => (
                  <button 
                    key={b} 
                    style={{ padding: '10px', borderRadius: 10, border: `2px solid ${form.budget === b ? "var(--gold)" : "var(--border)"}`, background: form.budget === b ? "rgba(200,181,96,.1)" : "var(--bg3)", color: form.budget === b ? "var(--gold)" : "var(--text)", fontWeight: 600, cursor: "pointer" }}
                    onClick={() => upd("budget", b)}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Travel Style</label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                {styles.map(s => (
                  <button 
                    key={s} 
                    style={{ padding: '10px', borderRadius: 10, border: `2px solid ${form.style === s ? "var(--gold)" : "var(--border)"}`, background: form.style === s ? "rgba(200,181,96,.1)" : "var(--bg3)", color: form.style === s ? "var(--gold)" : "var(--text)", fontSize: 13, cursor: "pointer" }}
                    onClick={() => upd("style", s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Interests (Select all that apply)</label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
                {interestsList.map(i => (
                  <button 
                    key={i} 
                    style={{ padding: '10px', borderRadius: 10, border: `2px solid ${form.interests.includes(i) ? "var(--gold)" : "var(--border)"}`, background: form.interests.includes(i) ? "rgba(200,181,96,.1)" : "var(--bg3)", color: form.interests.includes(i) ? "var(--gold)" : "var(--text)", fontSize: 12, textAlign: 'left', cursor: "pointer" }}
                    onClick={() => toggleInterest(i)}
                  >
                    {form.interests.includes(i) ? "✓ " : "+ "} {i}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
              <button className="btn btn-secondary" onClick={() => setStep(2)}>Back</button>
              <button 
                className="btn btn-primary" 
                onClick={handleSubmit} 
                disabled={loading}
                style={{ flex: 1, justifyContent: 'center' }}
              >
                {loading ? "Creating Trip..." : "Finish & Create Trip"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

