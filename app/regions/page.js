import Link from 'next/link';

export const metadata = {
  title: 'Regions | Founders Community',
  description: 'Explore the 9 active chapters of Founders Community across Uzbekistan.',
};

export default function RegionsPage() {
  const regions = [
    { name: 'Tashkent', students: 210, icon: '🏙️', desc: 'The central hub of innovation with the highest concentration of startups and university partnerships.' },
    { name: 'Samarkand', students: 85, icon: '🏛️', desc: 'A rapidly growing ecosystem focused on tourism-tech and regional commerce solutions.' },
    { name: 'Andijan', students: 65, icon: '🏭', desc: 'Pioneering hardware, agriculture-tech, and manufacturing innovations in the valley.' },
    { name: 'Fergana', students: 55, icon: '🌿', desc: 'A vibrant community of builders creating software for local businesses and communities.' },
    { name: 'Bukhara', students: 40, icon: '🏺', desc: 'Combining deep historical roots with modern ed-tech and cultural startup initiatives.' },
    { name: 'Namangan', students: 35, icon: '🌸', desc: 'Focused on e-commerce and logistics platforms connecting regional markets.' },
    { name: 'Navoi', students: 20, icon: '⚡', desc: 'Emerging tech hub exploring energy-tech and industrial software solutions.' },
    { name: 'Qashqadaryo', students: 15, icon: '🔥', desc: 'Growing community focused on energy sector innovations and local infrastructure.' },
    { name: 'Surxondaryo', students: 10, icon: '🌄', desc: 'Our newest chapter, building foundations for cross-border trade and logistics.' },
  ];

  return (
    <main className="regions-page">
      <div className="regions-header">
        <div className="container">
          <div className="section-label" style={{ textAlign: 'center' }}>Our Network</div>
          <h1 className="section-title centered" style={{ marginBottom: '24px' }}>We are <span className="gradient-text">everywhere.</span></h1>
          <p className="regions-subtitle centered">
            Founders Community operates across 9 regions in Uzbekistan, connecting over 500 active students and builders.
          </p>
        </div>
      </div>

      <section className="regions-grid-section">
        <div className="container">
          <div className="regions-grid">
            {regions.map((region, idx) => (
              <div key={idx} className="region-card">
                <div className="region-card-top">
                  <div className="region-icon">{region.icon}</div>
                  <div className="region-stats">
                    <span className="region-num">{region.students}</span>
                    <span className="region-label">Participants</span>
                  </div>
                </div>
                <h3 className="region-name">{region.name}</h3>
                <p className="region-desc">{region.desc}</p>
                <div className="region-bar">
                  <div className="region-bar-fill" style={{ width: `${(region.students / 210) * 100}%` }}></div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="regions-cta">
            <h3 style={{ fontSize: '24px', marginBottom: '12px' }}>Want to start a chapter?</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Don't see your region represented well? You can still apply and we'll help you start a local chapter.</p>
            <Link href="/apply" className="btn-primary">Apply Now</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
