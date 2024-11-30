import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { InterviewSetup } from './components/InterviewSetup';
import { InterviewRoom } from './components/InterviewRoom';
import { InterviewHistory } from './components/InterviewHistory';
import { InterviewReport } from './components/InterviewReport';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <InterviewSetup />
            </Layout>
          }
        />
        <Route path="/interview-room" element={<InterviewRoom />} />
        <Route
          path="/interview-history"
          element={
            <Layout>
              <InterviewHistory />
            </Layout>
          }
        />
        <Route
          path="/interview-report/:id"
          element={
            <Layout>
              <InterviewReport />
            </Layout>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;