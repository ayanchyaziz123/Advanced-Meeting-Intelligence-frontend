'use client';

import { useState } from 'react';
import Link from 'next/link';

// Mock data for meetings with organization field and simplified status
const MOCK_MEETINGS = [
  {
    id: 1,
    title: 'Weekly Team Standup',
    date: '2025-05-08T10:00:00',
    duration: '30 min',
    participants: 8,
    source: 'Zoom',
    status: 'summarized',
    organization: 'Engineering'
  },
  {
    id: 2,
    title: 'Product Planning',
    date: '2025-05-06T14:30:00',
    duration: '60 min',
    participants: 5,
    source: 'Upload',
    status: 'summarized',
    organization: 'Product'
  },
  {
    id: 3,
    title: 'Client Onboarding',
    date: '2025-05-05T11:00:00',
    duration: '45 min',
    participants: 3,
    source: 'Zoom',
    status: 'not summarized',
    organization: 'Sales'
  },
  {
    id: 4,
    title: 'Marketing Strategy',
    date: '2025-05-10T09:00:00',
    duration: '60 min',
    participants: 6,
    source: 'Teams',
    status: 'not summarized',
    organization: 'Marketing'
  },
  {
    id: 5,
    title: 'Sprint Review',
    date: '2025-05-09T15:00:00',
    duration: '45 min',
    participants: 10,
    source: 'Zoom',
    status: 'summarized',
    organization: 'Engineering'
  }
];

// Get unique organizations for the filter dropdown
const getUniqueOrganizations = (meetings) => {
  const organizations = meetings.map(meeting => meeting.organization);
  return ['All', ...new Set(organizations)];
};

export default function Dashboard() {
  const [meetings, setMeetings] = useState(MOCK_MEETINGS);
  const [searchTerm, setSearchTerm] = useState('');
  const [organizationFilter, setOrganizationFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: ''
  });

  const uniqueOrganizations = getUniqueOrganizations(meetings);
  const uniqueStatuses = ['All', 'summarized', 'not summarized'];
  
  const filteredMeetings = meetings.filter(meeting => {
    // Text search filter
    const matchesSearch = meeting.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Organization filter
    const matchesOrganization = organizationFilter === 'All' || meeting.organization === organizationFilter;
    
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
    
    return matchesSearch && matchesOrganization && matchesStatus && matchesDate;
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
    setOrganizationFilter('All');
    setStatusFilter('All');
    setDateFilter({
      startDate: '',
      endDate: ''
    });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            My Meetings
          </h2>
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
            
            {/* Organization filter */}
            <div>
              <label htmlFor="organization" className="block text-xs font-medium text-gray-500 mb-1">Organization</label>
              <select
                id="organization"
                name="organization"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                value={organizationFilter}
                onChange={(e) => setOrganizationFilter(e.target.value)}
              >
                {uniqueOrganizations.map((org) => (
                  <option key={org} value={org}>{org}</option>
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
                          <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                            <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
                            </svg>
                            {meeting.organization}
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