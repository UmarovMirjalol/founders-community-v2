'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="navbar">
      <div className="nav-inner">
        <Link href="/" className="nav-logo" onClick={closeMenu}>
          <svg width="220" height="36" viewBox="0 0 220 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="4" width="28" height="28" rx="8" fill="url(#logo-grad)" />
            <path d="M12 11H20M12 18H18M12 11V25" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M22 21C20.5 22.5 18 22.5 16.5 21" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <text x="40" y="22" fontFamily="Syne, sans-serif" fontSize="16" fontWeight="800" fill="#f0f0ff" letterSpacing="0.05em">
              FOUNDERS
            </text>
            <text x="135" y="22" fontFamily="Inter, sans-serif" fontSize="14" fontWeight="500" fill="#FF6A00" letterSpacing="0.05em">
              COMMUNITY
            </text>
            <defs>
              <linearGradient id="logo-grad" x1="2" y1="4" x2="30" y2="32" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FF6A00" />
                <stop offset="1" stopColor="#FF3D00" />
              </linearGradient>
            </defs>
          </svg>
        </Link>
        <ul className={`nav-links ${isOpen ? 'active' : ''}`}>
          <li><Link href="/#what-we-do" onClick={closeMenu}>About</Link></li>
          <li><Link href="/#programs" onClick={closeMenu}>Programs</Link></li>
          <li><Link href="/#impact" onClick={closeMenu}>Impact</Link></li>
          <li><Link href="/regions" onClick={closeMenu}>Regions</Link></li>
          <li><Link href="/dashboard" className="nav-links-dashboard" onClick={closeMenu}>Dashboard</Link></li>
        </ul>
        <div className="nav-actions">
          <Link href="/login" className="btn-nav-login" onClick={closeMenu}>Log In</Link>
          <Link href="/apply" className="btn-apply-nav" onClick={closeMenu}>Apply Now</Link>
          <button 
            className={`nav-burger ${isOpen ? 'active' : ''}`} 
            onClick={toggleMenu} 
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </nav>
  );
}
