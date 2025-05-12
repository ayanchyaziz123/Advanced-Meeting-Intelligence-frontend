import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-4 sm:p-6">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-indigo-700">MeetingSummarizer</h1>
      <p className="text-lg sm:text-xl max-w-xs sm:max-w-lg md:max-w-2xl mb-6 sm:mb-8">
        Transform your meetings into actionable insights with AI-powered transcription and summarization.
      </p>
      
      <div className="flex flex-col w-full max-w-xs sm:max-w-md sm:flex-row gap-3 sm:gap-4">
        <Link
          href="/dashboard"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 sm:py-3 px-4 sm:px-6 rounded-lg transition-colors"
        >
          Go to Dashboard
        </Link>
        <Link
          href="/dashboard/upload"
          className="w-full bg-white hover:bg-gray-100 text-indigo-600 font-medium py-2 sm:py-3 px-4 sm:px-6 rounded-lg border border-indigo-200 transition-colors"
        >
          Upload Meeting
        </Link>
      </div>
      
      <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 w-full max-w-xs sm:max-w-2xl lg:max-w-5xl px-2">
        <FeatureCard
          title="Transcribe & Summarize"
          description="Automatically convert speech to text and generate concise summaries."
          icon="📝"
        />
        <FeatureCard
          title="Zoom Integration"
          description="Import your Zoom meetings with a single click."
          icon="🔄"
        />
        <FeatureCard
          title="Export Options"
          description="Download your meeting insights as PDF or Word documents."
          icon="📤"
        />
      </div>
    </div>
  );
}

function FeatureCard({ title, description, icon }) {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow h-full">
      <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">{icon}</div>
      <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2 text-gray-800">{title}</h3>
      <p className="text-sm sm:text-base text-gray-600">{description}</p>
    </div>
  );
}