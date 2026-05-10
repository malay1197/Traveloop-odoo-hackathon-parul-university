import { useState, useEffect } from "react";
import { api } from "./services/api";
import { Sidebar } from "./components/Sidebar";
import { Auth } from "./pages/Auth";
import { Dashboard } from "./pages/Dashboard";
import { MyTrips } from "./pages/MyTrips";
import { CreateTrip } from "./pages/CreateTrip";
import { ItineraryBuilder } from "./pages/ItineraryBuilder";
import { ItineraryView } from "./pages/ItineraryView";
import { CitySearch } from "./pages/CitySearch";
import { ActivitySearch } from "./pages/ActivitySearch";
import { Budget } from "./pages/Budget";
import { PackingChecklist } from "./pages/PackingChecklist";
import { SharedItinerary } from "./pages/SharedItinerary";
import { TripNotes } from "./pages/TripNotes";
import { ProfileSettings } from "./pages/ProfileSettings";
import { Icon } from "./components/Icon";

// Placeholder components for the other pages (to be migrated similarly if needed)
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="main-content fade-up">
    <div className="page-header">
      <div className="page-title">{title}</div>
      <div className="page-subtitle">This page is currently being migrated to the server-side API.</div>
    </div>
    <div className="card" style={{ padding: 60, textAlign: 'center', color: 'var(--text3)' }}>
      <Icon name="settings" size={48} />
      <div style={{ marginTop: 16 }}>Content coming soon</div>
    </div>
  </div>
);

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [page, setPage] = useState("dashboard");
  const [initialized, setInitialized] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const init = async () => {
      const savedToken = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      
      if (savedToken && savedUser) {
        try {
          const res = await api.auth.getMe();
          setUser(res.user);
          localStorage.setItem('user', JSON.stringify(res.user));
        } catch (error) {
          console.error("Session verification failed:", error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }
      }
      setInitialized(true);
    };
    init();
  }, []);

  const handleLogin = (user: any, token: string) => {
    setUser(user);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setPage('dashboard');
  };

  const renderPage = () => {
    switch(page) {
      case "dashboard":   return <Dashboard onNav={setPage} user={user} />;
      case "trips":       return <MyTrips onNav={setPage} />;
      case "create":      return <CreateTrip onNav={setPage} />;
      case "builder":     return <ItineraryBuilder onNav={setPage} />;
      case "itinerary":   return <ItineraryView onNav={setPage} />;
      case "cities":      return <CitySearch />;
      case "activities":  return <ActivitySearch />;
      case "budget":      return <Budget />;
      case "packing":     return <PackingChecklist />;
      case "shared":      return <SharedItinerary />;
      case "notes":       return <TripNotes />;
      case "profile":     return <ProfileSettings user={user} onLogout={handleLogout} />;
      default:            return <Dashboard onNav={setPage} user={user} />;
    }
  };

  if (!initialized) return null;

  if (!user) return <Auth onLogin={handleLogin} />;

  return (
    <div className="app-shell">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar with Responsive Desktop/Mobile State */}
      <div className={`fixed inset-y-0 left-0 z-50 transform lg:relative lg:translate-x-0 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar current={page} onChange={(id) => { setPage(id); setSidebarOpen(false); }} user={user} />
      </div>

      <div style={{ flex: 1, overflow: "auto", background: "var(--bg)", display: 'flex', flexDirection: 'column' }}>
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between p-4 border-b border-[var(--border)] bg-[var(--bg2)]">
          <div className="font-display text-xl text-[var(--gold)]">Traveloop</div>
          <button onClick={() => setSidebarOpen(true)} className="p-2 text-[var(--text2)]">
            <Icon name="builder" size={24} />
          </button>
        </header>

        <main className="flex-1">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
