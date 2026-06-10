'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchMe = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const res = await fetch('/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!res.ok) {
          throw new Error('Unauthorized');
        }

        const data = await res.json();
        if (data.user.role === 'ADMIN') {
          router.push('/admin'); // Redirect admins to admin panel
          return;
        }
        
        setUser(data.user);
      } catch (err) {
        localStorage.removeItem('token');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (loading) {
    return (
      <main className="loading-page">
        <div className="spinner"></div>
        <div className="loading-text">Loading dashboard...</div>
      </main>
    );
  }

  if (!user) return null;

  return (
    <main className="dashboard-page">
      <div className="dashboard-inner">
        <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1>Dashboard</h1>
            <p>Welcome back, {user.name}</p>
          </div>
          <button onClick={handleLogout} className="btn-ghost">Logout</button>
        </div>

        <div className="dashboard-grid">
          {/* Profile Card */}
          <div className="dash-card">
            <h3><span className="card-icon">👤</span> Profile Details</h3>
            <div className="info-row">
              <span className="info-label">Name</span>
              <span className="info-value">{user.name}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Email</span>
              <span className="info-value">{user.email}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Region</span>
              <span className="info-value">{user.region || 'Not specified'}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Joined</span>
              <span className="info-value">{new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Application Card */}
          <div className="dash-card">
            <h3><span className="card-icon">📝</span> Application Status</h3>
            {user.application ? (
              <>
                <div style={{ marginBottom: '20px' }}>
                  <div className={`status-badge ${user.application.status.toLowerCase()}`}>
                    {user.application.status === 'PENDING' && <div className="badge-pulse"></div>}
                    {user.application.status}
                  </div>
                </div>
                <div className="info-row">
                  <span className="info-label">Track</span>
                  <span className="track-badge">{user.application.track}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Submitted</span>
                  <span className="info-value">{new Date(user.application.createdAt).toLocaleDateString()}</span>
                </div>
              </>
            ) : (
              <div className="empty-state" style={{ padding: '20px 0' }}>
                <p>You haven't submitted an application yet.</p>
                <button onClick={() => router.push('/apply')} className="btn-primary" style={{ marginTop: '16px' }}>
                  Apply Now
                </button>
              </div>
            )}
          </div>

          {/* Member Card (Only visible if accepted) */}
          {user.member && (
            <div className="dash-card full member-card">
              <div className="member-badge">Community Member</div>
              <h3 style={{ fontSize: '24px', marginBottom: '8px' }}>Founders Community {user.member.chapter}</h3>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '15px' }}>
                You are an official member of the {user.member.chapter} chapter. 
                Keep an eye out for emails about upcoming events, workshops, and exclusive opportunities.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
