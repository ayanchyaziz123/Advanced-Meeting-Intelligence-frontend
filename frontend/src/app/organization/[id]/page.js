'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

// Mock data for organizations
const MOCK_ORGANIZATIONS = [
    {
      id: 1,
      name: 'Next Generation Innovation L.L.C.',
      logo: '/logo_ngi.avif',  // Local placeholder image
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
  

// Mock data for meetings with organization field and platform sources
const MOCK_MEETINGS = [
    {
      id: 1,
      title: 'Weekly Dev Sync',
      date: '2025-05-08T10:00:00',
      duration: '30 min',
      participants: 6,
      source: 'Zoom',
      status: 'summarized',
      organizationId: 3  // CodeCrafters Team
    },
    {
      id: 2,
      title: 'Product Roadmap Session',
      date: '2025-05-06T14:30:00',
      duration: '60 min',
      participants: 4,
      source: 'Google Meet',
      status: 'summarized',
      organizationId: 4  // Local Entrepreneurs Network
    },
    {
      id: 3,
      title: 'Client Kickoff Call',
      date: '2025-05-05T11:00:00',
      duration: '45 min',
      participants: 2,
      source: 'Zoom',
      status: 'not summarized',
      organizationId: 6  // Neighborhood Book Club
    },
    {
      id: 4,
      title: 'Marketing Campaign Planning',
      date: '2025-05-10T09:00:00',
      duration: '60 min',
      participants: 5,
      source: 'MS Teams',
      status: 'not summarized',
      organizationId: 5  // TechBridge Community
    },
    {
      id: 5,
      title: 'Sprint Retrospective',
      date: '2025-05-09T15:00:00',
      duration: '45 min',
      participants: 7,
      source: 'Zoom',
      status: 'summarized',
      organizationId: 3  // CodeCrafters Team
    },
    {
      id: 6,
      title: 'Quarterly Strategy Review',
      date: '2025-05-12T13:00:00',
      duration: '90 min',
      participants: 10,
      source: 'Zoom',
      status: 'not summarized',
      organizationId: 1  // Bright Solutions Ltd.
    },
    {
      id: 7,
      title: 'Finance Review Meeting',
      date: '2025-05-14T10:00:00',
      duration: '60 min',
      participants: 3,
      source: 'Google Meet',
      status: 'summarized',
      organizationId: 1  // Bright Solutions Ltd.
    },
    {
      id: 8,
      title: 'Design Kickoff',
      date: '2025-05-07T09:00:00',
      duration: '60 min',
      participants: 6,
      source: 'MS Teams',
      status: 'summarized',
      organizationId: 2  // Freelance Designers Hub
    },
    {
      id: 9,
      title: 'Portfolio Review Check-in',
      date: '2025-05-15T14:00:00',
      duration: '30 min',
      participants: 4,
      source: 'Zoom',
      status: 'not summarized',
      organizationId: 2  // Freelance Designers Hub
    }
  ];

// Get unique meeting sources for the filter dropdown
const getUniqueSources = (meetings) => {
  const sources = meetings.map(meeting => meeting.source);
  return ['All Sources', ...new Set(sources)];
};

export default function OrganizationDetail({ params }) {
  // For Next.js App Router 
  const organizationId = parseInt(params?.id);
  
  // For Pages Router (if you're using it instead)
  // const router = useRouter();
  // const organizationId = parseInt(router.query.id);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState('All Sources');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: ''
  });

  // Get organization data
  const organization = MOCK_ORGANIZATIONS.find(org => org.id === organizationId);
  
  // Get unique meeting sources
  const uniqueSources = getUniqueSources(MOCK_MEETINGS);
  const uniqueStatuses = ['All', 'summarized', 'not summarized'];
  
  // Filter meetings based on organization ID and other filters
  const filteredMeetings = MOCK_MEETINGS.filter(meeting => {
    // First filter by organization ID
    if (meeting.organizationId !== organizationId) {
      return false;
    }
    
    // Text search filter
    const matchesSearch = meeting.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Source filter
    const matchesSource = sourceFilter === 'All Sources' || meeting.source === sourceFilter;
    
    // Status filter
    const matchesStatus = statusFilter === 'All' || meeting.status === statusFilter;
    
    // Date filter
    let matchesDate = true;
    if (dateFilter.startDate) {
      matchesDate = matchesDate && new Date(meeting.date) >= new Date(dateFilter.startDate);
    }
    if (dateFilter.endDate) {
      // Add one day to end date for inclusive filtering
      const endDate = new Date(dateFilter.endDate);
      endDate.setDate(endDate.getDate() + 1);
      matchesDate = matchesDate && new Date(meeting.date) < endDate;
    }
    
    return matchesSearch && matchesSource && matchesStatus && matchesDate;
  });

  const handleDateFilterChange = (e) => {
    const { name, value } = e.target;
    setDateFilter(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSourceFilter('All Sources');
    setStatusFilter('All');
    setDateFilter({
      startDate: '',
      endDate: ''
    });
  };

  // If organization is not found, show message or redirect
  if (!organization) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900">Organization not found</h2>
          <p className="mt-2 text-gray-600">The organization you're looking for doesn't exist.</p>
          <Link 
            href="/organizations"
            className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Back to Organizations
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <Link 
            href="/organizations"
            className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            <svg className="mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Back to Organizations
          </Link>
          <div className="flex items-center mt-2">
            <img className="h-10 w-10 rounded-full mr-4" src={organization.logo} alt={organization.name} />
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              {organization.name} Meetings
            </h2>
          </div>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Link 
            href="/dashboard/upload"
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Upload New Meeting
          </Link>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
        <div className="px-4 py-5 sm:px-6">
          {/* Search and main filters row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            {/* Search input */}
            <div className="relative rounded-md shadow-sm">
              <input
                type="text"
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-3 py-2 border-gray-300 rounded-md"
                placeholder="Search meetings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            {/* Source filter */}
            <div>
              <label htmlFor="source" className="block text-xs font-medium text-gray-500 mb-1">Source</label>
              <select
                id="source"
                name="source"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
              >
                {uniqueSources.map((source) => (
                  <option key={source} value={source}>{source}</option>
                ))}
              </select>
            </div>
            
            {/* Status filter */}
            <div>
              <label htmlFor="status" className="block text-xs font-medium text-gray-500 mb-1">Status</label>
              <select
                id="status"
                name="status"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                {uniqueStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status === 'All' 
                      ? 'All' 
                      : status === 'summarized' 
                        ? 'Summarized' 
                        : 'Not Summarized'}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear filters button */}
            <div className="flex items-end">
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Date range filter row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-xs font-medium text-gray-500 mb-1">From Date</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                value={dateFilter.startDate}
                onChange={handleDateFilterChange}
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-xs font-medium text-gray-500 mb-1">To Date</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                value={dateFilter.endDate}
                onChange={handleDateFilterChange}
              />
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            {filteredMeetings.length > 0 ? (
              filteredMeetings.map((meeting) => (
                <li key={meeting.id}>
                  <Link 
                    href={meeting.status === 'summarized' 
                      ? `/meeting/${meeting.id}` 
                      : `/summarize/${meeting.id}`} 
                    className="block hover:bg-gray-50"
                  >
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-indigo-600 truncate">{meeting.title}</p>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${meeting.status === 'summarized' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                              {meeting.status === 'summarized' ? 'Summarized' : 'Not Summarized'}
                            </p>
                          </div>
                        </div>
                        <div className="ml-2 flex-shrink-0 flex">
                          <span className="inline-flex items-center text-xs text-gray-500">
                            {new Date(meeting.date).toLocaleDateString()} • {meeting.duration}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            {meeting.participants} participants
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p>
                            Source: {meeting.source}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))
            ) : (
              <li className="py-12">
                <div className="text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No meetings found</h3>
                  <p className="mt-1 text-sm text-gray-500">Try adjusting your filters or search term.</p>
                  <div className="mt-6">
                    <button
                      onClick={clearFilters}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Clear Filters
                    </button>
                    <Link
                      href="/dashboard/upload"
                      className="ml-3 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Upload New Meeting
                    </Link>
                  </div>
                </div>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}