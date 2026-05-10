import React from 'react';
import { Icon } from './Icon';

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "home" },
  { id: "trips", label: "My Trips", icon: "trips" },
  { id: "create", label: "Create Trip", icon: "create" },
  { id: "builder", label: "Itinerary Builder", icon: "builder" },
  { id: "itinerary", label: "Itinerary View", icon: "view" },
  { id: "cities", label: "City Search", icon: "search" },
  { id: "activities", label: "Activity Search", icon: "activity" },
  { id: "budget", label: "Budget & Costs", icon: "budget" },
  { id: "packing", label: "Packing Checklist", icon: "pack" },
  { id: "shared", label: "Shared Itinerary", icon: "share" },
  { id: "notes", label: "Trip Notes", icon: "notes" },
  { id: "profile", label: "Profile & Settings", icon: "profile" },
];

interface SidebarProps {
  current: string;
  onChange: (id: string) => void;
  user: any;
}

export const Sidebar: React.FC<SidebarProps> = ({ current, onChange, user }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span />
        Traveloop
      </div>
      <nav className="sidebar-nav">
        {NAV_ITEMS.map(item => (
          <a
            key={item.id}
            className={current === item.id ? "active" : ""}
            onClick={() => onChange(item.id)}
          >
            <Icon name={item.icon} size={15} />
            {item.label}
          </a>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <div className="sidebar-user">
          <div className="avatar">{(user?.name || 'JD').substring(0, 2).toUpperCase()}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user?.name || 'Jane Doe'}</div>
            <div className="sidebar-user-role">Explorer Pro</div>
          </div>
        </div>
      </div>
    </aside>
  );
};
