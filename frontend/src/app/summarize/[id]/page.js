'use client';

import { useState } from 'react';
import { Loader2, FileText, ListOrdered, CheckSquare, Clipboard, Check } from 'lucide-react';

export default function Transcribe({ meetingId }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [summary, setSummary] = useState('');
  const [tasks, setTasks] = useState([]);
  const [checkedTasks, setCheckedTasks] = useState({});
  const [newTask, setNewTask] = useState('');

  const handleTranscribe = async () => {
    setIsProcessing(true);
    setTranscription('');
    setSummary('');
    setTasks([]);
    setCheckedTasks({});

    // Simulate API call with timeout
    setTimeout(() => {
      // Fake results for demo
      const fakeTranscription = `
        Welcome everyone to the weekly team standup. Today we'll review sprint progress, blockers, and goals.
        John reported backend API is 80% done. Design team is finalizing UI for dashboard module.
        Blocker: deployment delay on staging environment.
      `;
      const fakeSummary = `The team reviewed sprint progress. Backend is nearly complete. Design is finalizing dashboard UI. Deployment issues on staging were flagged as a blocker.`;
      
      const fakeTasks = [
        'Complete the remaining 20% of the backend API – John',
        'Finalize UI for the dashboard module – Design Team',
        'Resolve staging environment deployment issues – DevOps Team',
      ];
      
      setTranscription(fakeTranscription);
      setSummary(fakeSummary);
      setTasks(fakeTasks);
      
      // Initialize all tasks as unchecked
      const initialCheckedState = {};
      fakeTasks.forEach((_, index) => {
        initialCheckedState[index] = false;
      });
      setCheckedTasks(initialCheckedState);
      
      setIsProcessing(false);
    }, 3000);
  };

  const toggleTaskCheck = (index) => {
    setCheckedTasks(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const addNewTask = () => {
    if (newTask.trim()) {
      setTasks(prev => [...prev, newTask]);
      setCheckedTasks(prev => ({
        ...prev,
        [tasks.length]: false
      }));
      setNewTask('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addNewTask();
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Meeting ID: {meetingId}</h1>
      
      <button 
        className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md mb-8 hover:bg-blue-700 transition-colors w-full md:w-auto"
        onClick={handleTranscribe}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            <FileText className="mr-2 h-4 w-4" />
            <span>Start Transcription & Summarization</span>
          </>
        )}
      </button>

      {transcription && (
        <div className="mb-8 p-4 bg-gray-50 rounded-md">
          <div className="flex items-center mb-3">
            <FileText className="mr-2 h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold">Transcription</h2>
          </div>
          <div className="whitespace-pre-line">
            {transcription}
          </div>
        </div>
      )}

      {summary && (
        <div className="mb-8 p-4 bg-gray-50 rounded-md">
          <div className="flex items-center mb-3">
            <Clipboard className="mr-2 h-5 w-5 text-green-600" />
            <h2 className="text-xl font-semibold">Summary</h2>
          </div>
          <div>
            {summary}
          </div>
        </div>
      )}

      {tasks.length > 0 && (
        <div className="p-4 bg-gray-50 rounded-md">
          <div className="flex items-center mb-3">
            <ListOrdered className="mr-2 h-5 w-5 text-purple-600" />
            <h2 className="text-xl font-semibold">Tasks from Meeting</h2>
          </div>
          
          <ul className="space-y-2 mb-4">
            {tasks.map((task, index) => (
              <li key={index} className="flex items-start">
                <div className="flex items-center h-6">
                  <input
                    type="checkbox"
                    id={`task-${index}`}
                    checked={checkedTasks[index] || false}
                    onChange={() => toggleTaskCheck(index)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>
                <label
                  htmlFor={`task-${index}`}
                  className={`ml-3 block text-sm font-medium ${
                    checkedTasks[index] ? 'text-gray-400 line-through' : 'text-gray-700'
                  }`}
                >
                  {task}
                </label>
              </li>
            ))}
          </ul>
          
          <div className="flex mt-4">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add a new task..."
              className="flex-1 rounded-l-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              onClick={addNewTask}
              className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <CheckSquare className="h-4 w-4 mr-1" />
              Add Task
            </button>
          </div>
        </div>
      )}
    </div>
  );
}