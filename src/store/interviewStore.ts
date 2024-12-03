import { create } from 'zustand';
import { Interview } from '../types/interview';
import { sampleInterviews } from '../data/sampleInterviews';
// import fs from 'fs';
// import path from 'path';

// const filePath = '../data/sampleInterviews'

interface InterviewState {
  currentInterview: Interview | null;
  pastInterviews: Interview[];
  setCurrentInterview: (interview: Interview | null) => void;
  addPastInterview: (interview: Interview) => void;
}

// fs.writeFileSync(filePath, JSON.stringify(sampleInterviews, null, 2), 'utf-8');

export const useInterviewStore = create<InterviewState>((set) => ({
  currentInterview: null,
  pastInterviews: sampleInterviews, // Initialize with sample data
  setCurrentInterview: (interview) => set({ currentInterview: interview }),
  addPastInterview: (interview) => {
      //sampleInterviews.push(interview);
      set((state) => ({
        pastInterviews: [...state.pastInterviews, interview],
      }));
  },
}));