import './globals.css';
import Navbar from './components/Navbar';

export const metadata = {
  title: 'Founders Community — Building the Next Generation of Founders',
  description: "Founders Community is a student-led entrepreneurship network helping young builders launch startups, join the venture ecosystem, and access mentors & capital across Uzbekistan's emerging markets.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
