import { create } from 'zustand';
import { Interview, Role } from '../types/interview';
import { sampleInterviews } from '../data/sampleInterviews';

interface InterviewState {
  currentInterview: Interview | null;
  pastInterviews: Interview[];
  setCurrentInterview: (interview: Interview | null) => void;
  addPastInterview: (interview: Interview) => void;
}

export const useInterviewStore = create<InterviewState>((set) => ({
  currentInterview: null,
  pastInterviews: sampleInterviews, // Initialize with sample data
  setCurrentInterview: (interview) => set({ currentInterview: interview }),
  addPastInterview: (interview) =>
    set((state) => ({
      pastInterviews: [...state.pastInterviews, interview],
    })),
}));