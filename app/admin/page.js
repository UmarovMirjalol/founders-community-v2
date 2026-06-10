'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('applications'); // applications, analytics
  const [data, setData] = useState({ applications: [], analytics: null });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const router = useRouter();

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      // Parallel fetch
      const [appRes, analyticsRes] = await Promise.all([
        fetch('/api/applications', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/analytics', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      if (appRes.status === 401 || appRes.status === 403) {
        throw new Error('Not authorized');
      }

      const appData = await appRes.json();
      const analyticsData = await analyticsRes.json();

      setData({
        applications: appData.applications || [],
        analytics: analyticsData.analytics || null,
      });
    } catch (err) {
      console.error(err);
      router.push('/dashboard'); // Kick back if not admin
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/applications/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      // Refresh data
      fetchData();
    } catch (err) {
      console.error('Update failed', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (loading) {
    return (
      <main className="loading-page">
        <div className="spinner"></div>
        <div className="loading-text">Loading admin panel...</div>
      </main>
    );
  }

  const filteredApps = statusFilter === 'ALL' 
    ? data.applications 
    : data.applications.filter(app => app.status === statusFilter);

  return (
    <main className="admin-page">
      <div className="admin-inner">
        <div className="admin-header">
          <h1>Admin Portal</h1>
          <button onClick={handleLogout} className="btn-ghost">Logout</button>
        </div>

        <div className="admin-tabs">
          <button 
            className={`admin-tab ${activeTab === 'applications' ? 'active' : ''}`}
            onClick={() => setActiveTab('applications')}
          >
            Applications
          </button>
          <button 
            className={`admin-tab ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics
          </button>
        </div>

        {activeTab === 'applications' && (
          <div>
            <div className="admin-stats">
              <div className="admin-stat-card">
                <div className="admin-stat-label">Total Applicants</div>
                <div className="admin-stat-value">{data.applications.length}</div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-label">Pending Review</div>
                <div className="admin-stat-value" style={{ color: '#f59e0b', WebkitTextFillColor: 'initial', background: 'none' }}>
                  {data.applications.filter(a => a.status === 'PENDING').length}
                </div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-label">Accepted Members</div>
                <div className="admin-stat-value" style={{ color: '#10b981', WebkitTextFillColor: 'initial', background: 'none' }}>
                  {data.applications.filter(a => a.status === 'ACCEPTED').length}
                </div>
              </div>
            </div>

            <div className="filter-bar">
              {['ALL', 'PENDING', 'ACCEPTED', 'REJECTED'].map(status => (
                <button
                  key={status}
                  className={`filter-btn ${statusFilter === status ? 'active' : ''}`}
                  onClick={() => setStatusFilter(status)}
                >
                  {status}
                </button>
              ))}
            </div>

            <div className="apps-table">
              <div className="apps-table-header">
                <div>Applicant</div>
                <div>Motivation</div>
                <div>Track</div>
                <div>Region</div>
                <div>Status</div>
                <div>Actions</div>
              </div>

              {filteredApps.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">📋</div>
                  <h3>No applications found</h3>
                  <p>There are no applications matching the current filter.</p>
                </div>
              ) : (
                filteredApps.map(app => (
                  <div key={app.id} className="apps-table-row">
                    <div>
                      <div className="name-cell">{app.user.name}</div>
                      <div className="email-cell">{app.user.email}</div>
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {app.motivation}
                    </div>
                    <div className="track-cell">{app.track}</div>
                    <div className="region-cell">{app.user.region}</div>
                    <div>
                      <span className={`status-badge ${app.status.toLowerCase()}`}>{app.status}</span>
                    </div>
                    <div className="action-btns">
                      {app.status === 'PENDING' && (
                        <>
                          <button className="btn-accept" onClick={() => handleUpdateStatus(app.id, 'ACCEPTED')}>Accept</button>
                          <button className="btn-reject" onClick={() => handleUpdateStatus(app.id, 'REJECTED')}>Reject</button>
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && data.analytics && (
          <div className="analytics-grid">
            <div className="analytics-card">
              <h3>Community Overview</h3>
              <div className="info-row"><span className="info-label">Total Users</span><span className="info-value">{data.analytics.totalUsers}</span></div>
              <div className="info-row"><span className="info-label">Total Members</span><span className="info-value">{data.analytics.totalMembers}</span></div>
              <div className="info-row"><span className="info-label">Total Applications</span><span className="info-value">{data.analytics.totalApplications}</span></div>
              <div className="info-row"><span className="info-label">Acceptance Rate</span><span className="info-value">{data.analytics.acceptanceRate}%</span></div>
            </div>

            <div className="analytics-card">
              <h3>Track Popularity</h3>
              <div className="chart-bar-group">
                {data.analytics.byTrack.map((t, i) => {
                  const max = Math.max(...data.analytics.byTrack.map(x => x.count), 1);
                  const pct = Math.round((t.count / max) * 100);
                  return (
                    <div key={i} className="chart-bar-item">
                      <div className="chart-bar-label">{t.track}</div>
                      <div className="chart-bar-track">
                        <div className="chart-bar-fill" style={{ width: `${pct}%` }}>{t.count}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="analytics-card" style={{ gridColumn: '1 / -1' }}>
              <h3>Regional Distribution</h3>
              <div className="chart-bar-group">
                {[...data.analytics.byRegion].sort((a,b) => b.count - a.count).map((r, i) => {
                  const max = Math.max(...data.analytics.byRegion.map(x => x.count), 1);
                  const pct = Math.round((r.count / max) * 100);
                  return (
                    <div key={i} className="chart-bar-item">
                      <div className="chart-bar-label">{r.region}</div>
                      <div className="chart-bar-track">
                        <div className="chart-bar-fill" style={{ width: `${pct}%` }}>{r.count}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
