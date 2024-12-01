import { useParams } from 'react-router-dom';
import { FileText, Clock, Activity, Video } from 'lucide-react';
import { useInterviewStore } from '../store/interviewStore';

export function InterviewReport() {
  const { id } = useParams();
  const { pastInterviews } = useInterviewStore();
  const interview = pastInterviews.find((i) => i.id === id);

  if (!interview) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold">Interview Report Not Found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="h-8 w-8" />
          <h1 className="text-3xl font-bold">Interview Report</h1>
        </div>
        <p className="text-gray-400 mb-8">
          Detailed report for your interview on{' '}
          {new Date(interview.date).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </p>

        <div className="grid gap-6">
          {/* Interview Recording Section */}
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Video className="h-5 w-5" />
              <h2 className="text-xl font-semibold">Interview Recording</h2>
            </div>
            <div className="text-gray-400">
              {interview.videoUrl ? (
                <video
                  src={interview.videoUrl}
                  controls
                  className="w-full rounded-lg"
                />
              ) : (
                'No video recording available'
              )}
            </div>
          </div>

          {/* Interview Details Section */}
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5" />
              <h2 className="text-xl font-semibold">Interview Details</h2>
            </div>
            <div className="grid gap-4">
              <div>
                <span className="text-gray-400">Role:</span>{' '}
                <span className="font-medium">{interview.role}</span>
              </div>
              <div>
                <span className="text-gray-400">Duration:</span>{' '}
                <span className="font-medium">
                {Math.floor(interview.duration / 60000)} minutes {Math.floor(Math.floor(interview.duration / 1000)%60)} seconds
                </span>
              </div>
              <div>
                <span className="text-gray-400">Status:</span>{' '}
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {interview.status.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Interview Transcript Section */}
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5" />
              <h2 className="text-xl font-semibold">Interview Transcript</h2>
            </div>
            <div className="space-y-4">
              {interview.transcript.length > 0 ? (
                interview.transcript.map((message) => (
                  <div
                    key={message.id}
                    className="flex flex-col gap-1 border-b border-gray-700 pb-4"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium capitalize">
                        {message.speaker}
                      </span>
                      <span className="text-sm text-gray-400">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-gray-300">{message.message}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No transcript available</p>
              )}
            </div>
          </div>

          {/* Performance Evaluation Section */}
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="h-5 w-5" />
              <h2 className="text-xl font-semibold">Performance Evaluation</h2>
            </div>
            <div className="text-gray-400">{interview.feedback}</div>
          </div>
        </div>
      </div>
    </div>
  );
}