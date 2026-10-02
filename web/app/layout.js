import './globals.css';
import Navbar from '../components/Navbar';

export const metadata = {
  title: 'DocuMind | Ask your docs anything',
  description: 'AI-Powered Developer Docs Agent',
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
