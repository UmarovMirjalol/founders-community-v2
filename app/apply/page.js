'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ApplyPage() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1 = form, 2 = success
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    region: '',
    track: '',
    motivation: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Register User
      const regRes = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          age: formData.age,
          region: formData.region,
        }),
      });

      const regData = await regRes.json();
      if (!regRes.ok) throw new Error(regData.error || 'Failed to register');

      // Store token
      localStorage.setItem('token', regData.token);

      // 2. Submit Application
      const appRes = await fetch('/api/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${regData.token}`,
        },
        body: JSON.stringify({
          track: formData.track,
          motivation: formData.motivation,
        }),
      });

      const appData = await appRes.json();
      if (!appRes.ok) throw new Error(appData.error || 'Failed to submit application');

      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (step === 2) {
    return (
      <main className="apply-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="form-card" style={{ maxWidth: '500px', textAlign: 'center' }}>
          <div className="form-success">
            <div className="success-icon">✓</div>
            <h3>Application Received!</h3>
            <p style={{ marginBottom: '24px' }}>Welcome to Founders Community. We'll review your application soon.</p>
            <button className="btn-primary" onClick={() => router.push('/dashboard')}>
              Go to Dashboard
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="apply-page">
      <div className="apply-page-inner">
        <div className="apply-page-header">
          <h1>Join <span className="gradient-text">Founders Community</span></h1>
          <p>We select motivated builders, researchers, and future founders.<br/>Tell us who you are and what you're building.</p>
        </div>

        <div className="form-card">
          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="Your full name" />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="your@email.com" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Create Password</label>
                <input type="password" name="password" required value={formData.password} onChange={handleChange} placeholder="••••••••" minLength={6} />
              </div>
              <div className="form-group">
                <label>Age</label>
                <input type="number" name="age" required value={formData.age} onChange={handleChange} placeholder="e.g. 21" min={14} max={99} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>City / Region</label>
                <select name="region" required value={formData.region} onChange={handleChange}>
                  <option value="" disabled>Select your region</option>
                  <option value="Tashkent">Tashkent</option>
                  <option value="Andijan">Andijan</option>
                  <option value="Samarkand">Samarkand</option>
                  <option value="Fergana">Fergana</option>
                  <option value="Namangan">Namangan</option>
                  <option value="Bukhara">Bukhara</option>
                  <option value="Navoi">Navoiy</option>
                  <option value="Qashqadaryo">Qashqadaryo</option>
                  <option value="Surxondaryo">Surxondaryo</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Track</label>
                <select name="track" required value={formData.track} onChange={handleChange}>
                  <option value="" disabled>Choose your track</option>
                  <option value="FOUNDER">🚀 Founders Track</option>
                  <option value="VENTURE">📊 Venture Track</option>
                  <option value="RESEARCH">🧠 Research Track</option>
                </select>
              </div>
            </div>

            <div className="form-group full">
              <label>Motivation</label>
              <textarea name="motivation" required value={formData.motivation} onChange={handleChange} placeholder="Who are you? What are you building or interested in?" rows={4}></textarea>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '16px' }} disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
