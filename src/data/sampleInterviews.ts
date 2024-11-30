import { Interview, TranscriptMessage } from '../types/interview';

const createTranscriptMessage = (
  speaker: 'interviewer' | 'candidate',
  message: string,
  timestamp: Date
): TranscriptMessage => ({
  id: Math.random().toString(36).substr(2, 9),
  speaker,
  message,
  timestamp,
});

export const sampleInterviews: Interview[] = [
  {
    id: '1',
    role: 'SDE',
    skills: ['JavaScript', 'React', 'Node.js'],
    date: new Date('2024-03-15T10:00:00'),
    status: 'completed',
    duration: 10000,
    transcript: [
      createTranscriptMessage(
        'interviewer',
        'Can you explain how React hooks work?',
        new Date('2024-03-15T10:01:00')
      ),
      createTranscriptMessage(
        'candidate',
        'React hooks are functions that allow us to use state and lifecycle features in functional components. useState and useEffect are the most commonly used hooks...',
        new Date('2024-03-15T10:02:00')
      ),
      createTranscriptMessage(
        'interviewer',
        'Could you give an example of useEffect usage?',
        new Date('2024-03-15T10:03:00')
      ),
      createTranscriptMessage(
        'candidate',
        'useEffect is used for side effects in components. For example, fetching data, subscribing to events, or manually changing the DOM...',
        new Date('2024-03-15T10:04:00')
      ),
    ],
    feedback: 'The candidate demonstrated a strong understanding of React and JavaScript concepts.',
  },
  {
    id: '2',
    role: 'Marketing Manager',
    skills: ['Digital Marketing', 'SEO', 'Content Strategy'],
    date: new Date('2024-03-14T14:00:00'),
    duration: 83631,
    status: 'completed',
    transcript: [
      createTranscriptMessage(
        'interviewer',
        'What experience do you have with digital marketing campaigns?',
        new Date('2024-03-14T14:01:00')
      ),
      createTranscriptMessage(
        'candidate',
        'I have led several successful digital marketing campaigns, focusing on multi-channel strategies including social media, email marketing, and PPC advertising...',
        new Date('2024-03-14T14:02:00')
      ),
      createTranscriptMessage(
        'interviewer',
        'How do you measure the success of a marketing campaign?',
        new Date('2024-03-14T14:03:00')
      ),
      createTranscriptMessage(
        'candidate',
        'I focus on key metrics such as ROI, conversion rates, customer acquisition cost, and engagement metrics...',
        new Date('2024-03-14T14:04:00')
      ),
    ],
    feedback: 'The candidate demonstrated a strong understanding of React and JavaScript concepts.',
  },
];