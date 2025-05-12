'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Mock data for a single meeting
const MOCK_MEETING = {
  id: 1,
  title: 'Weekly Team Standup',
  date: '2025-05-08T10:00:00',
  duration: '30 min',
  participants: ['John Doe', 'Sarah Smith', 'Mike Johnson', 'Alice Brown', 'Bob Wilson', 'Carol Taylor', 'David Lee', 'Eve Chen'],
  source: 'Zoom',
  status: 'completed',
  summary: {
    keyPoints: [
      'Q2 marketing campaign achieved 120% of target goals',
      'New product launch scheduled for August 15th',
      'Budget approval needed for additional design resources',
      'Customer satisfaction scores increased by 18% this quarter'
    ],
    decisions: [
      'Approved additional $20K for marketing campaign',
      'Pushed back beta release to June 30th',
      'Agreed to hire two additional designers'
    ],
    actionItems: [
      { task: 'Schedule follow-up with design team', assignee: 'Sarah Smith', dueDate: '2025-05-15' },
      { task: 'Prepare budget justification document', assignee: 'Mike Johnson', dueDate: '2025-05-20' },
      { task: 'Review beta feedback and compile report', assignee: 'John Doe', dueDate: '2025-05-22' }
    ]
  },
  transcript: `
John Doe: Let's get started with our weekly standup. 

Sarah Smith: Before we begin, I want to share that the Q2 marketing campaign has exceeded expectations. We're at 120% of our target goals.

Mike Johnson: That's fantastic news! I think we should consider allocating more resources to this campaign given its success.

John Doe: I agree. What kind of additional budget would you need?

Sarah Smith: I think with an additional $20K, we could expand our reach significantly.

John Doe: That makes sense to me. Does anyone have objections to approving this additional budget?

Alice Brown: No objections here. The ROI seems clear.

John Doe: Great, let's consider that approved. Let's talk about the product launch timeline.

Bob Wilson: We're still on track for the August 15th launch date, but the beta release might need to be pushed back.

Carol Taylor: Why is that?

Bob Wilson: We've identified some UX issues that need to be addressed before we can release the beta.

John Doe: How much more time do you need?

Bob Wilson: I'm thinking two weeks would be sufficient. So pushing it to June 30th.

John Doe: Alright. That still gives us enough buffer before the full launch. Let's do that.

David Lee: I wanted to bring up the need for additional design resources. Our current team is stretched thin.

Alice Brown: I've noticed that too. The quality of work is excellent, but the turnaround time is getting longer.

John Doe: What specifically do we need?

David Lee: I think two more designers would get us back on track.

Eve Chen: Our customer satisfaction scores have increased by 18% this quarter, so I think investing in design makes sense.

John Doe: I agree. Let's move forward with hiring two additional designers. David, can you work with HR on this?

David Lee: Yes, I'll handle it.

Sarah Smith: I'll schedule a follow-up with the design team to discuss priorities.

Mike Johnson: I'll prepare the budget justification document for the new hires.

John Doe: Great. I'll review the beta feedback when it's ready and compile a report. Let's plan to discuss that in two weeks.

Everyone: Sounds good!

John Doe: Thanks everyone. Let's adjourn for today.
  `
};

export default function MeetingDetailPage({ params }) {
  const router = useRouter();
  const { id } = params;
  const [meeting, setMeeting] = useState(MOCK_MEETING);
  const [activeTab, setActiveTab] = useState('summary');
  const [isExporting, setIsExporting] = useState(false);
  
  // Simulate export functionality
  const handleExport = (format) => {
    setIsExporting(true);
    
    // Simulate processing time
    setTimeout(() => {
      setIsExporting(false);
      // In a real app, this would trigger a download
      alert(`Meeting summary exported as ${format} file!`);
    }, 1500);
  };
  
  if (!meeting) {
    return (
      <div className="max-w-6xl mx-auto text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Meeting not found</h2>
        <p className="mt-2 text-gray-600">The meeting you're looking for does not exist or has been removed.</p>
        <div className="mt-6">
          <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-500">
            Return to dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="mr-3 text-gray-500 hover:text-gray-700"
          >
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate">
            {meeting.title}
          </h2>
        </div>
        
        <div className="flex flex-wrap gap-4 items-center text-sm text-gray-500">
          <span className="flex items-center">
            <svg className="mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {new Date(meeting.date).toLocaleDateString()}
          </span>
          <span className="flex items-center">
            <svg className="mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {meeting.duration}
          </span>
          <span className="flex items-center">
            <svg className="mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            {meeting.participants.length} participants
          </span>
          <span className="flex items-center">
            <svg className="mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Source: {meeting.source}
          </span>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'summary'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('summary')}
            >
              Summary
            </button>
            <button
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'transcript'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('transcript')}
            >
              Transcript
            </button>
          </nav>
        </div>

        {activeTab === 'summary' ? (
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Key Points</h3>
                  <ul className="space-y-3">
                    {meeting.summary.keyPoints.map((point, index) => (
                      <li key={index} className="flex">
                        <svg className="h-6 w-6 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Decisions Made</h3>
                  <ul className="space-y-3">
                    {meeting.summary.decisions.map((decision, index) => (
                      <li key={index} className="flex">
                        <svg className="h-6 w-6 text-blue-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{decision}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div>
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Action Items</h3>
                  <ul className="space-y-4">
                    {meeting.summary.actionItems.map((item, index) => (
                      <li key={index} className="bg-white p-3 rounded border border-gray-200">
                        <div className="flex items-start">
                          <input
                            type="checkbox"
                            className="h-4 w-4 mt-1 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                          <div className="ml-3 flex-1">
                            <p className="text-sm font-medium text-gray-900">{item.task}</p>
                            <div className="mt-1 flex items-center text-xs text-gray-500">
                              <span>{item.assignee}</span>
                              <span className="mx-1">•</span>
                              <span>Due: {item.dueDate}</span>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Participants</h4>
                    <div className="flex flex-wrap gap-2">
                      {meeting.participants.map((participant, index) => (
                        <span 
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                        >
                          {participant}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Export Summary</h4>
                  <div className="flex flex-col space-y-3">
                    <button
                      onClick={() => handleExport('PDF')}
                      disabled={isExporting}
                      className={`inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md ${
                        isExporting ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-50 text-red-700 hover:bg-red-100'
                      }`}
                    >
                      <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      {isExporting ? 'Exporting...' : 'Export as PDF'}
                    </button>
                    <button
                      onClick={() => handleExport('Word')}
                      disabled={isExporting}
                      className={`inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md ${
                        isExporting ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                      }`}
                    >
                      <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      {isExporting ? 'Exporting...' : 'Export as Word'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="px-4 py-5 sm:p-6">
            <div className="mb-4 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Full Transcript</h3>
              <button
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
              >
                Copy Transcript
              </button>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg overflow-auto max-h-[600px]">
              <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800">
                {meeting.transcript}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}