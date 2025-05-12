import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'MeetingSummarizer - Transcribe and Summarize Your Meetings',
  description: 'An AI-powered platform for meeting transcription and summarization',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="flex">
            <Sidebar />
            <main className="flex-1 p-6">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
