'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../redux/auth/authSlices'; // Adjust path as needed
import ManageOrganizations from '../../src/app/components/ManageOrganizations';

// Mock data for organizations
const MOCK_ORGANIZATIONS = [
  {
    id: 1,
    name: 'Next Generation Innovation L.L.C.',
    logo: '/logo_ngi.avif',
    meetingCount: 7
  },
  {
    id: 2,
    name: 'Freelance Designers Hub',
    logo: '/logos/freelance_designers.png',
    meetingCount: 5
  },
  {
    id: 3,
    name: 'CodeCrafters Team',
    logo: '/logos/codecrafters_team.png',
    meetingCount: 11
  },
  {
    id: 4,
    name: 'Local Entrepreneurs Network',
    logo: '/logos/local_entrepreneurs.png',
    meetingCount: 6
  },
  {
    id: 5,
    name: 'TechBridge Community',
    logo: '/logos/techbridge_community.png',
    meetingCount: 8
  },
  {
    id: 6,
    name: 'Neighborhood Book Club',
    logo: '/logos/book_club.png',
    meetingCount: 4
  }
];

// Platform button data
const PLATFORMS = [
  {
    id: 'zoom',
    name: 'Zoom',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3.51 8.95c-.65.41-1.05 1.11-1.05 1.87v8.36c0 1.24 1.01 2.25 2.25 2.25h8c.76 0 1.46-.4 1.87-1.05L3.51 8.95zM20.49 15.05c.65-.41 1.05-1.11 1.05-1.87V4.82c0-1.24-1.01-2.25-2.25-2.25h-8c-.76 0-1.46.4-1.87 1.05l11.07 11.43z"/>
      </svg>
    ),
    enabled: true,
    bgColor: 'bg-blue-600',
    hoverColor: 'hover:bg-blue-700',
    description: 'Connect to retrieve your Zoom recordings'
  },
  {
    id: 'google-meet',
    name: 'Google Meet',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
      </svg>
    ),
    enabled: false,
    bgColor: 'bg-gray-400',
    hoverColor: 'hover:bg-gray-500',
    description: 'Coming soon - Retrieve Google Meet recordings'
  },
  {
    id: 'ms-teams',
    name: 'MS Teams',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.7 6.24A6.23 6.23 0 0018.4 2.5C16.8 1.4 14.8 1.4 13.2 2.5c-1.6 1.1-2.6 2.9-2.6 4.8v1.2c-1.5-.8-3.2-1.2-5-1.2C2.5 7.3 0 9.8 0 13s2.5 5.7 5.6 5.7c1.8 0 3.5-.4 5-1.2v1.2c0 1.9 1 3.7 2.6 4.8 1.6 1.1 3.6 1.1 5.2 0a6.23 6.23 0 002.3-3.74c.5-1.9.2-3.9-.8-5.57.5-.6.8-1.4.8-2.2s-.3-1.6-.8-2.2c1-1.67 1.3-3.67.8-5.57z"/>
      </svg>
    ),
    enabled: false,
    bgColor: 'bg-gray-400',
    hoverColor: 'hover:bg-gray-500',
    description: 'Coming soon - Retrieve Microsoft Teams recordings'
  }
];

// Organizations component for authenticated users
function OrganizationsPage() {
  const [selectedPlatform, setSelectedPlatform] = useState('zoom');

  const handlePlatformSelect = (platformId) => {
    const platform = PLATFORMS.find(p => p.id === platformId);
    if (platform && platform.enabled) {
      setSelectedPlatform(platformId);
      console.log(`Selected platform: ${platform.name}`);
    }
  };

  const handleConnectZoom = () => {
    if (selectedPlatform === 'zoom') {
      // Create sample Zoom OAuth URL for demonstration
      const sampleZoomAuthUrl = 'https://zoom.us/oauth/authorize?' + 
        'response_type=code&' +
        'client_id=YOUR_CLIENT_ID&' +
        'redirect_uri=' + encodeURIComponent('http://localhost:3000/auth/zoom/callback') + '&' +
        'scope=recording:read user:read&' +
        'state=sample_state_123';
      
      console.log('Redirecting to Zoom OAuth...');
      console.log('Zoom Auth URL:', sampleZoomAuthUrl);
      
      // Redirect to Zoom OAuth (sample)
      window.location.href = sampleZoomAuthUrl;
    }
  };

  return (
    <ManageOrganizations/>
  );
}

// Landing page component for unauthenticated users (unchanged)
function LandingPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Advanced Meeting</span>{' '}
                  <span className="block text-indigo-600 xl:inline">Intelligence</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Transform your virtual meetings with AI-powered recording, transcription, and summarization. 
                  Compatible with Zoom, Google Meet, Microsoft Teams, and more.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link
                      href="/auth/register"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                    >
                      Get Started Free
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link
                      href="/auth/login"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10"
                    >
                      Sign In
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <div className="h-56 w-full bg-gradient-to-br from-indigo-500 to-purple-600 sm:h-72 md:h-96 lg:w-full lg:h-full flex items-center justify-center">
            <div className="text-center text-white">
              <svg className="mx-auto h-24 w-24 mb-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <p className="text-lg font-semibold">AI-Powered Meeting Intelligence</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need for smarter meetings
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              {/* Recording Feature */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Smart Recording</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Automatically record meetings from Zoom, Google Meet, Microsoft Teams, and other popular platforms with crystal-clear quality.
                  </p>
                </div>
              </div>

              {/* Transcription Feature */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">AI Transcription</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Get accurate, real-time transcriptions with speaker identification and timestamp precision for easy reference.
                  </p>
                </div>
              </div>

              {/* Summarization Feature */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Intelligent Summaries</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Generate comprehensive meeting summaries with key points, action items, and decisions automatically extracted.
                  </p>
                </div>
              </div>

              {/* Integration Feature */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Universal Integration</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Works seamlessly with all major video conferencing platforms including Zoom, Google Meet, Microsoft Teams, and more.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-700">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to transform your meetings?</span>
            <span className="block">Start your free trial today.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-indigo-200">
            Join thousands of teams already using our advanced meeting intelligence platform.
          </p>
          <Link
            href="/auth/register"
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 sm:w-auto"
          >
            Get Started Free
          </Link>
        </div>
      </div>
    </div>
  );
}

// Main component that conditionally renders based on authentication
export default function ConditionalPage() {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return isAuthenticated ? <OrganizationsPage /> : <LandingPage />;
}