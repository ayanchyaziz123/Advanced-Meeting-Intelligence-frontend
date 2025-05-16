'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [participants, setParticipants] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [zoomConnected, setZoomConnected] = useState(false);
  const [zoomMeetings, setZoomMeetings] = useState([]);
  const [showZoomModal, setShowZoomModal] = useState(false);
  const [isLoadingZoomMeetings, setIsLoadingZoomMeetings] = useState(false);
  const [selectedZoomMeeting, setSelectedZoomMeeting] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file && !selectedZoomMeeting) return;

    setIsUploading(true);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 5;
      });
    }, 300);

    // Simulate API call with timeout
    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);
      
      setTimeout(() => {
        // Redirect to dashboard after "processing"
        router.push('/dashboard');
      }, 1000);
    }, 3000);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setSelectedZoomMeeting(null); // Clear selected Zoom meeting when manual file is uploaded
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setSelectedZoomMeeting(null); // Clear selected Zoom meeting when manual file is uploaded
    }
  };

  const connectZoom = () => {
    // In a real app, this would redirect to Zoom OAuth flow
    // For this demo, we'll simulate a successful connection
    setIsLoadingZoomMeetings(true);
    
    // Simulate API call to fetch Zoom meetings
    setTimeout(() => {
      setZoomConnected(true);
      setZoomMeetings([
        { id: 1, title: 'Weekly Team Standup', date: '2025-05-10', participants: 'John, Sarah, Alex', duration: '45 mins' },
        { id: 2, title: 'Product Planning', date: '2025-05-08', participants: 'Mike, Emma, John', duration: '60 mins' },
        { id: 3, title: 'Client Meeting - Acme Corp', date: '2025-05-07', participants: 'Sarah, David, Client Team', duration: '30 mins' },
        { id: 4, title: 'UX Design Review', date: '2025-05-05', participants: 'Emma, Design Team', duration: '90 mins' },
      ]);
      setIsLoadingZoomMeetings(false);
      setShowZoomModal(true);
    }, 1500);
  };

  const selectZoomMeeting = (meeting) => {
    setSelectedZoomMeeting(meeting);
    setTitle(meeting.title);
    setDate(meeting.date);
    setParticipants(meeting.participants);
    setFile(null); // Clear manual file when Zoom meeting is selected
    setShowZoomModal(false);
  };

  const disconnectZoom = () => {
    setZoomConnected(false);
    setZoomMeetings([]);
    setSelectedZoomMeeting(null);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Upload Meeting
          </h2>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meeting Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="Weekly Team Meeting"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meeting Date
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Participants (comma separated)
              </label>
              <input
                type="text"
                value={participants}
                onChange={(e) => setParticipants(e.target.value)}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="John, Sarah, Mike"
              />
            </div>
          </div>

          {selectedZoomMeeting ? (
            <div className="mb-6">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700">Selected Zoom Recording</label>
                <button 
                  type="button" 
                  onClick={() => setSelectedZoomMeeting(null)}
                  className="text-sm text-indigo-600 hover:text-indigo-900"
                >
                  Change
                </button>
              </div>
              <div className="mt-2 bg-indigo-50 p-4 rounded-md">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{selectedZoomMeeting.title}</p>
                    <p className="text-xs text-gray-500">Date: {selectedZoomMeeting.date} • Duration: {selectedZoomMeeting.duration}</p>
                    <p className="text-xs text-gray-500">Participants: {selectedZoomMeeting.participants}</p>
                  </div>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm6 13h-5v5h-2v-5H6v-2h5V6h2v5h5v2z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Recording
              </label>
              <div 
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${
                  dragActive ? 'border-indigo-300 bg-indigo-50' : 'border-gray-300'
                } border-dashed rounded-md`}
              >
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                    >
                      <span>Upload a file</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="audio/*,video/*" onChange={handleFileChange} />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">MP3, MP4, WAV, M4A up to 500MB</p>
                </div>
              </div>
              {file && (
                <div className="mt-2 text-sm text-gray-500">
                  Selected file: <span className="font-medium">{file.name}</span> ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                </div>
              )}
            </div>
          )}

          {isUploading && (
            <div className="mb-6">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-indigo-700">{uploadProgress < 100 ? 'Uploading...' : 'Processing...'}</span>
                <span className="text-sm font-medium text-indigo-700">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-3"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={(!file && !selectedZoomMeeting) || isUploading}
              className={`py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                ${(!file && !selectedZoomMeeting) || isUploading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'}`}
            >
              {isUploading ? 'Uploading...' : 'Upload & Process'}
            </button>
          </div>
        </form>
      </div>

      <div className="mt-8 bg-indigo-50 border border-indigo-100 rounded-lg p-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-medium text-indigo-800">Zoom Integration</h3>
          {zoomConnected && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <svg className="-ml-0.5 mr-1.5 h-2 w-2 text-green-400" fill="currentColor" viewBox="0 0 8 8">
                <circle cx="4" cy="4" r="3" />
              </svg>
              Connected
            </span>
          )}
        </div>
        
        {!zoomConnected ? (
          <>
            <p className="text-sm text-indigo-700 mb-4">
              Import your Zoom meetings directly by connecting your account. This will allow automatic import of recordings and transcripts.
            </p>
            <button
              type="button"
              onClick={connectZoom}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm6 13h-5v5h-2v-5H6v-2h5V6h2v5h5v2z"/>
              </svg>
              Connect Zoom Account
            </button>
          </>
        ) : (
          <>
            <p className="text-sm text-indigo-700 mb-4">
              Your Zoom account is connected. You can import meetings or disconnect your account.
            </p>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setShowZoomModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Import Zoom Meetings
              </button>
              <button
                type="button"
                onClick={disconnectZoom}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Disconnect
              </button>
            </div>
          </>
        )}
      </div>

      {/* Zoom Meetings Modal */}
      {showZoomModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Select Zoom Meeting
                    </h3>
                    <div className="mt-4">
                      {isLoadingZoomMeetings ? (
                        <div className="flex justify-center items-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                          <span className="ml-2 text-indigo-600">Loading meetings...</span>
                        </div>
                      ) : (
                        <div className="max-h-96 overflow-y-auto">
                          <ul className="divide-y divide-gray-200">
                            {zoomMeetings.map((meeting) => (
                              <li key={meeting.id} className="py-4 cursor-pointer hover:bg-gray-50" onClick={() => selectZoomMeeting(meeting)}>
                                <div className="flex space-x-3">
                                  <div className="flex-shrink-0">
                                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                      </svg>
                                    </div>
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium text-gray-900 truncate">{meeting.title}</p>
                                    <p className="text-sm text-gray-500">Date: {meeting.date} • Duration: {meeting.duration}</p>
                                    <p className="text-sm text-gray-500 truncate">Participants: {meeting.participants}</p>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => setShowZoomModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}