'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';

export default function LandingPage() {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Canvas animation logic ported from main.js
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animFrame;

    function resizeCanvas() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = -Math.random() * 0.5 - 0.2;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.life = 0;
        this.maxLife = Math.random() * 200 + 100;
        this.hue = 22; // Orange hue for branding (was purple)
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life++;
        if (this.life > this.maxLife || this.y < -10 || this.x < -10 || this.x > canvas.width + 10) {
          this.reset();
          this.y = canvas.height + 10;
        }
        const progress = this.life / this.maxLife;
        this.currentOpacity = this.opacity * Math.sin(progress * Math.PI);
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = this.currentOpacity;
        ctx.fillStyle = `hsl(${this.hue}, 100%, 50%)`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    function initParticles() {
      particles = [];
      for (let i = 0; i < 60; i++) {
        const p = new Particle();
        p.life = Math.random() * p.maxLife;
        particles.push(p);
      }
    }

    function drawConnections() {
      const maxDist = 100;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.08;
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.strokeStyle = '#FF6A00'; // Orange connection lines
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
            ctx.restore();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawConnections();
      particles.forEach(p => { p.update(); p.draw(); });
      animFrame = requestAnimationFrame(animate);
    }

    resizeCanvas();
    initParticles();
    animate();

    window.addEventListener('resize', () => {
      resizeCanvas();
      initParticles();
    });

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animFrame);
    };
  }, []);

  return (
    <main>
      {/* HERO */}
      <section id="hero" className="hero">
        <div className="hero-bg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/hero_bg.png" alt="" className="hero-bg-img" />
          <div className="hero-overlay"></div>
          <canvas ref={canvasRef} className="hero-canvas"></canvas>
        </div>
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot"></span>
            Now accepting applications · Summer 2025
          </div>
          <h1 className="hero-title">
            Founders<br /><span className="gradient-text">Community</span>
          </h1>
          <p className="hero-sub">
            Building the next generation of founders<br className="desktop-br" />
            across emerging markets.
          </p>
          <div className="hero-stats">
            <div className="stat-item">
              <div><span className="stat-num">500</span><span className="stat-suffix">+</span></div>
              <span className="stat-label">Students</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div><span className="stat-num">9</span></div>
              <span className="stat-label">Regions</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div><span className="stat-prefix">$</span><span className="stat-num">50</span><span className="stat-suffix">K+</span></div>
              <span className="stat-label">Opportunities</span>
            </div>
          </div>
          <div className="hero-cta">
            <Link href="/apply" className="btn-primary">Apply to Join</Link>
            <a href="https://t.me/umarovmirjalol" target="_blank" rel="noopener noreferrer" className="btn-secondary">Partner with Us</a>
          </div>
        </div>
        <div className="hero-scroll">
          <span>Scroll</span>
          <div className="scroll-line"></div>
        </div>
      </section>

      {/* WHAT WE DO */}
      <section id="what-we-do" className="section-wwd">
        <div className="container">
          <div className="section-label">What We Do</div>
          <div className="wwd-grid">
            <div className="wwd-left">
              <h2 className="section-title">We help young builders <span className="gradient-text">go further,</span> faster.</h2>
              <p className="wwd-desc">
                Founders Community is a student-led entrepreneurship network across Uzbekistan. 
                We connect ambitious students with the tools, people, and opportunities to turn ideas into reality.
              </p>
              <p className="wwd-desc">
                We operate across Uzbekistan with active regional chapters — bridging ambitious 
                students with the real startup ecosystem.
              </p>
              <Link href="/apply" className="btn-primary">Start Your Journey</Link>
            </div>
            <div className="wwd-right">
              <div className="wwd-cards">
                <div className="wwd-card">
                  <div className="wwd-icon">🚀</div>
                  <h3>Launch Startups</h3>
                  <p>Get hands-on support building your first venture from idea to MVP.</p>
                </div>
                <div className="wwd-card">
                  <div className="wwd-icon">💼</div>
                  <h3>Join Venture Ecosystem</h3>
                  <p>Connect with VCs, accelerators, and the broader startup ecosystem.</p>
                </div>
                <div className="wwd-card">
                  <div className="wwd-icon">🤝</div>
                  <h3>Access Mentors & Capital</h3>
                  <p>Tap into a network of experienced mentors and early-stage funding.</p>
                </div>
                <div className="wwd-card">
                  <div className="wwd-icon">🏗️</div>
                  <h3>Build Real Experience</h3>
                  <p>Work on live projects, research, and initiatives that matter.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* IMPACT */}
      <section id="impact" className="section-impact">
        <div className="impact-bg-glow"></div>
        <div className="container">
          <div className="section-label">Our Impact</div>
          <h2 className="section-title centered">Numbers that <span className="gradient-text">speak.</span></h2>
          <div className="impact-grid">
            <div className="impact-card">
              <div className="impact-num">500+</div>
              <div className="impact-label-text">Students Engaged</div>
              <div className="impact-bar"><div className="impact-bar-fill" style={{width: '90%'}}></div></div>
            </div>
            <div className="impact-card">
              <div className="impact-num">9</div>
              <div className="impact-label-text">Regional Chapters</div>
              <div className="impact-bar"><div className="impact-bar-fill" style={{width: '75%'}}></div></div>
            </div>
            <div className="impact-card">
              <div className="impact-num">4</div>
              <div className="impact-label-text">Institutional Partnerships</div>
              <div className="impact-bar"><div className="impact-bar-fill" style={{width: '55%'}}></div></div>
            </div>
            <div className="impact-card">
              <div className="impact-num">$50K+</div>
              <div className="impact-label-text">Startup Opportunities</div>
              <div className="impact-bar"><div className="impact-bar-fill" style={{width: '85%'}}></div></div>
            </div>
          </div>
        </div>
      </section>

      {/* PROGRAMS */}
      <section id="programs" className="section-programs">
        <div className="container">
          <div className="section-label">Programs</div>
          <h2 className="section-title centered">Three tracks.<br /><span className="gradient-text">One mission.</span></h2>
          <div className="programs-grid">
            <div className="program-card featured">
              <div className="program-tag">Most Popular</div>
              <div className="program-icon">🚀</div>
              <h3 className="program-name">Founders Track</h3>
              <p className="program-desc">For early-stage startup builders ready to turn ideas into real products and companies.</p>
              <ul className="program-features">
                <li>Startup workshops & sprints</li>
                <li>MVP development support</li>
                <li>Investor pitch prep</li>
                <li>Peer founder network</li>
              </ul>
              <Link href="/apply?track=FOUNDER" className="btn-program">Apply →</Link>
            </div>
            <div className="program-card">
              <div className="program-icon">📊</div>
              <h3 className="program-name">Venture Track</h3>
              <p className="program-desc">For students interested in VC, research, deal analysis, and the investment side of startups.</p>
              <ul className="program-features">
                <li>VC deal flow exposure</li>
                <li>Investment memos</li>
                <li>Market research projects</li>
                <li>Fund partner mentorship</li>
              </ul>
              <Link href="/apply?track=VENTURE" className="btn-program">Apply →</Link>
            </div>
            <div className="program-card">
              <div className="program-icon">🧠</div>
              <h3 className="program-name">Research Track</h3>
              <p className="program-desc">Academic and applied research with mentors from global universities and research institutions.</p>
              <ul className="program-features">
                <li>Global mentor access</li>
                <li>Co-authored research</li>
                <li>Publication support</li>
                <li>Academic network</li>
              </ul>
              <Link href="/apply?track=RESEARCH" className="btn-program">Apply →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <div className="footer-inner">
            <div className="footer-brand">
              <div className="footer-logo">
                <svg width="220" height="36" viewBox="0 0 220 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="4" width="28" height="28" rx="8" fill="url(#footer-logo-grad)" />
                  <path d="M12 11H20M12 18H18M12 11V25" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M22 21C20.5 22.5 18 22.5 16.5 21" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <text x="40" y="22" fontFamily="Syne, sans-serif" fontSize="16" fontWeight="800" fill="#f0f0ff" letterSpacing="0.05em">
                    FOUNDERS
                  </text>
                  <text x="135" y="22" fontFamily="Inter, sans-serif" fontSize="14" fontWeight="500" fill="#FF6A00" letterSpacing="0.05em">
                    COMMUNITY
                  </text>
                  <defs>
                    <linearGradient id="footer-logo-grad" x1="2" y1="4" x2="30" y2="32" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#FF6A00" />
                      <stop offset="1" stopColor="#FF3D00" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <p className="footer-tagline">Building the next generation of founders across emerging markets.</p>
            </div>
            <div className="footer-links">
              <div className="footer-col">
                <h4>Programs</h4>
                <a href="#programs">Founders Track</a>
                <a href="#programs">Venture Track</a>
                <a href="#programs">Research Track</a>
              </div>
              <div className="footer-col">
                <h4>Contact</h4>
                <a href="mailto:hello@founderscommunity.uz">hello@founderscommunity.uz</a>
                <Link href="/apply">Apply Now</Link>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2025 Founders Community · Uzbekistan</p>
            <p>Built by founders, for founders.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
