export type Role = 'SDE' | 'Marketing Manager' | 'Sales Executive';

export interface Interview {
  id: string;
  role: Role;
  skills: string[];
  date: Date;
  duration: number;
  videoUrl?: string;
  transcript: TranscriptMessage[];
  status: 'completed' | 'ongoing';
  feedback: string;
}

export interface TranscriptMessage {
  id: string;
  speaker: 'interviewer' | 'candidate';
  message: string;
  timestamp: Date;
}

export interface InterviewReport {
  id: string;
  interviewId: string;
  feedback: string;
  score: number;
  recommendations: string[];
}