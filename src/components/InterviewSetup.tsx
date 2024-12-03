import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Plus, X } from 'lucide-react';
import { Role } from '../types/interview';
import { Button } from './ui/Button';

export function InterviewSetup() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<Role>('Sales Executive');
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  
  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleStartInterview = () => {
    if (skills.length > 0) {
      navigate('/interview-room', { state: { selectedRole, skills } });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-white mb-6">
          Interview Setup
        </h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-200">
              Select Role
            </label>
            <div className="mt-1 relative">
              <select
                value={selectedRole}
                onChange={(e) => {
                  setSelectedRole(e.target.value as Role);
                }}
                className="block w-full pl-3 pr-10 py-2 text-white bg-gray-700 border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="SDE">SDE</option>
                <option value="Marketing Manager">Marketing Manager</option>
                <option value="Sales Executive">Sales Executive</option>
              </select>
              {/* <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" /> */}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200">
              Skills
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-l-md bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Add a skill"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-600 rounded-r-md bg-gray-700 hover:bg-gray-600"
              >
                <Plus className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            <div className="mt-2 flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center px-2.5 py-2 rounded-full text-xs font-medium bg-blue-900 text-blue-200"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="ml-1 inline-flex items-center"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <Button
            onClick={handleStartInterview}
            disabled={skills.length === 0}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Start Interview
          </Button>
        </div>
      </div>
    </div>
  );
}