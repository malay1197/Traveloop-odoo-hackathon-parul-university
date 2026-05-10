import React from 'react';

interface ProfileSettingsProps {
  user: any;
  onLogout: () => void;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({ user, onLogout }) => {
  const initials = user?.name ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase() : '??';

  return (
    <div className="main-content fade-up">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div className="page-title">Profile & Settings</div>
          <div className="page-subtitle">Manage your account and preferences</div>
        </div>
        <button className="btn btn-secondary" onClick={onLogout}>Sign Out</button>
      </div>

      <div className="card" style={{ maxWidth: 600 }}>
        <div style={{ display: "flex", gap: 20, alignItems: "center", marginBottom: 24 }}>
          <div className="avatar" style={{ width: 64, height: 64, fontSize: 24 }}>{initials}</div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 18 }}>{user?.name || 'Traveler'}</div>
            <div style={{ fontSize: 14, color: 'var(--text3)' }}>{user?.email}</div>
            <button className="btn btn-secondary btn-sm mt-2">Change Photo</button>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Name</label>
          <input className="form-input" defaultValue={user?.name || ''} />
        </div>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="form-input" defaultValue={user?.email || ''} readOnly />
        </div>
        <button className="btn btn-primary mt-4">Save Changes</button>
      </div>
    </div>
  );
};
