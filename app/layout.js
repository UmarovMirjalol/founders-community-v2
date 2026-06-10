import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'Founders Community — Building the Next Generation of Founders',
  description: "Founders Community is a student-led entrepreneurship network helping young builders launch startups, join the venture ecosystem, and access mentors & capital across Uzbekistan's emerging markets.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav className="navbar">
          <div className="nav-inner">
            <Link href="/" className="nav-logo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="Founders Community" className="logo-img" />
            </Link>
            <ul className="nav-links">
              <li><Link href="/#what-we-do">About</Link></li>
              <li><Link href="/#programs">Programs</Link></li>
              <li><Link href="/#impact">Impact</Link></li>
              <li><Link href="/regions">Regions</Link></li>
              <li><Link href="/dashboard" className="nav-links-dashboard">Dashboard</Link></li>
            </ul>
            <div className="nav-actions">
              <Link href="/login" className="btn-nav-login">Log In</Link>
              <Link href="/apply" className="btn-apply-nav">Apply Now</Link>
              <button className="nav-burger" aria-label="Toggle menu">
                <span></span><span></span><span></span>
              </button>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
