'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  getZoomMeetings,
  getZoomConnectionStatus,
  selectZoomMeetings,
  selectZoomLoading,
  selectZoomError,
  selectZoomIsConnected,
  clearMessages
} from '../../../redux/auth/zoomSlice'; // Adjust import path as needed
import CreateMeetingModal from './../../components/CreateMeetingModal'; // Adjust import path as needed


export default function Meetings() {
  const dispatch = useDispatch();
  const params = useParams();
  
  // For Next.js App Router 
  const organizationId = params?.id;
  
  // Redux state
  const zoomMeetings = useSelector(selectZoomMeetings);
  const zoomLoading = useSelector(selectZoomLoading);
  const zoomError = useSelector(selectZoomError);
  const isZoomConnected = useSelector(selectZoomIsConnected);
  
  // Debug logging
  console.log('Debug - Meetings page organizationId:', organizationId);
  console.log('Debug - isZoomConnected:', isZoomConnected);
  console.log('Debug - zoomMeetings:', zoomMeetings);
  
  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState('All Sources');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: ''
  });
  const [isCreateMeetingModalOpen, setIsCreateMeetingModalOpen] = useState(false);



  
  // Load meetings on component mount and check Zoom status
  useEffect(() => {
    console.log('Component mounted, checking Zoom status...');
    // Always check status first
    dispatch(getZoomConnectionStatus());
  }, [dispatch]);

  // Fetch meetings when Zoom is connected and organization ID is available
  useEffect(() => {
    if (isZoomConnected && organizationId) {
      console.log('Zoom is connected, loading meetings for org:', organizationId);
      dispatch(getZoomMeetings(organizationId));
    }
  }, [dispatch, isZoomConnected, organizationId]);

  // Clear error messages after 5 seconds
  useEffect(() => {
    if (zoomError) {
      const timer = setTimeout(() => {
        dispatch(clearMessages());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [zoomError, dispatch]);

  // Get unique meeting sources for filter
  const getUniqueSources = (meetings) => {
    const sources = meetings.map(meeting => meeting.source || 'Zoom');
    return ['All Sources', ...new Set(sources)];
  };

  const uniqueSources = getUniqueSources(zoomMeetings || []);
  const uniqueStatuses = ['All', 'scheduled', 'started', 'ended'];
  
  // Filter meetings based on filters
  const filteredMeetings = (zoomMeetings || []).filter(meeting => {
    // Text search filter
    const matchesSearch = meeting.topic?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Source filter
    const meetingSource = meeting.source || 'Zoom';
    const matchesSource = sourceFilter === 'All Sources' || meetingSource === sourceFilter;
    
    // Status filter
    const matchesStatus = statusFilter === 'All' || meeting.status === statusFilter;
    
    // Date filter
    let matchesDate = true;
    if (dateFilter.startDate && meeting.start_time) {
      matchesDate = matchesDate && new Date(meeting.start_time) >= new Date(dateFilter.startDate);
    }
    if (dateFilter.endDate && meeting.start_time) {
      const endDate = new Date(dateFilter.endDate);
      endDate.setDate(endDate.getDate() + 1);
      matchesDate = matchesDate && new Date(meeting.start_time) < endDate;
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

  const formatMeetingDateTime = (dateTime) => {
    if (!dateTime) return 'N/A';
    return new Date(dateTime).toLocaleString();
  };

  const getMeetingStatus = (meeting) => {
    if (!meeting.start_time) return 'scheduled';
    
    const now = new Date();
    const startTime = new Date(meeting.start_time);
    const endTime = new Date(startTime.getTime() + (meeting.duration * 60000));
    
    if (now < startTime) return 'scheduled';
    if (now >= startTime && now <= endTime) return 'started';
    return 'ended';
  };

  // If organization ID is not found, show message
  if (!organizationId) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900">Invalid Organization</h2>
          <p className="mt-2 text-gray-600">Organization ID is required to view meetings.</p>
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
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
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
          <div className="mt-2">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Meetings
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Organization ID: {organizationId}
            </p>
          </div>
        </div>
        <div className="mt-4 flex space-x-3 md:mt-0 md:ml-4">
          {/* Create Meeting Button */}
          <button
            onClick={() => setIsCreateMeetingModalOpen(true)}
            disabled={!isZoomConnected}
            className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              isZoomConnected 
                ? 'bg-indigo-600 hover:bg-indigo-700' 
                : 'bg-gray-400 cursor-not-allowed'
            }`}
            title={!isZoomConnected ? 'Connect to Zoom first to create meetings' : 'Create new Zoom meeting'}
          >
            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create Meeting
          </button>
          
          <Link 
            href="/dashboard/upload"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Upload Recording
          </Link>
        </div>
      </div>

      {/* Error Messages */}
      {zoomError && (
        <div className="mb-4 rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">{zoomError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Zoom Connection Status */}
      {!isZoomConnected && (
        <div className="mb-4 rounded-md bg-yellow-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-yellow-800">
                Zoom is not connected. Connect your Zoom account to create and view meetings.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
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
                    {status === 'All' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
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
      </div>

      {/* Meetings List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="border-t border-gray-200">
          {zoomLoading ? (
            <div className="px-4 py-12 text-center">
              <div className="inline-flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading meetings...
              </div>
            </div>
          ) : filteredMeetings.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {filteredMeetings.map((meeting) => {
                const status = getMeetingStatus(meeting);
                return (
                  <li key={meeting.id}>
                     <Link href={`/meeting/${meeting.meeting_id || meeting.id}`}>
                      <div className="px-4 py-4 sm:px-6 hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <p className="text-sm font-medium text-indigo-600 truncate">{meeting.topic}</p>
                            <div className="ml-2 flex-shrink-0 flex">
                              <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                ${status === 'scheduled' ? 'bg-blue-100 text-blue-800' : 
                                  status === 'started' ? 'bg-green-100 text-green-800' : 
                                  'bg-gray-100 text-gray-800'}`}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </p>
                            </div>
                          </div>
                          <div className="ml-2 flex-shrink-0 flex">
                            <span className="inline-flex items-center text-xs text-gray-500">
                              {formatMeetingDateTime(meeting.start_time)} • {meeting.duration || 'N/A'} min
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                              Meeting ID: {meeting.id}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 space-x-2">
                            {meeting.join_url && (
                              <a
                                href={meeting.join_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              >
                                Join Meeting
                              </a>
                            )}
                            <span className="inline-flex items-center text-xs text-gray-400">
                              <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                              </svg>
                              View Details
                            </span>
                          </div>
                        </div>
                        {meeting.agenda && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-600">{meeting.agenda}</p>
                          </div>
                        )}
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="py-12">
              <div className="text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  {!isZoomConnected ? 'Connect to Zoom to see meetings' : 'No meetings found'}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {!isZoomConnected 
                    ? 'You need to connect your Zoom account to create and view meetings.'
                    : 'Try adjusting your filters or create a new meeting.'}
                </p>
                <div className="mt-6">
                  {!isZoomConnected ? (
                    <Link
                      href="/organizations"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Connect to Zoom
                    </Link>
                  ) : (
                    <>
                      <button
                        onClick={clearFilters}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Clear Filters
                      </button>
                      <button
                        onClick={() => setIsCreateMeetingModalOpen(true)}
                        className="ml-3 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        Create Meeting
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Meeting Modal */}
      <CreateMeetingModal
        isOpen={isCreateMeetingModalOpen}
        onClose={() => setIsCreateMeetingModalOpen(false)}
        organizationId={organizationId}
        isZoomConnected={isZoomConnected}
      />
    </div>
  );
}