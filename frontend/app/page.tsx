'use client'
import React, { useState, useEffect } from 'react';
import { Plus, X, Check } from 'lucide-react';

interface Project {
  id: number;
  title: string;
  description?: string;
  system_prompt: string;
  LLMs: string[];
  Eval_LLM: string;
  created_at: Date;
  updated_at: Date;
}

interface ProjectFormData {
  title: string;
  description: string;
  system_prompt: string;
  LLMs: string[];
  Eval_LLM: string;
}

// JUST for testing , will get from the backend
const AVAILABLE_LLMS = [
  "gemini-1.5-flash",
  "gemini-2.0-flash-exp",
  "gemini-1.5-flash-8b"
];

const ProjectDashboard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    description: '',
    system_prompt: '',
    LLMs: [],
    Eval_LLM: ''
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('https://5000-idx-llm-evaluation-1735645177260.cluster-rcyheetymngt4qx5fpswua3ry4.cloudworkstations.dev/projects',
      {  
          credentials: 'include',
        }
      );
      if (response.ok) {
        const data = await response.json();
        console.log(data)
        setProjects(data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLLM = (llm: string) => {
    setFormData(prev => ({
      ...prev,
      LLMs: prev.LLMs.includes(llm)
        ? prev.LLMs.filter(item => item !== llm)
        : [...prev.LLMs, llm]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('https://5000-idx-llm-evaluation-1735645177260.cluster-rcyheetymngt4qx5fpswua3ry4.cloudworkstations.dev/new_project', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        const newProject: Project = await response.json();
        setProjects(prev => [...prev, newProject]);
        setIsModalOpen(false);
        setFormData({
          title: '',
          description: '',
          system_prompt: '',
          LLMs: [],
          Eval_LLM: ''
        });
      }
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  // Format date to readable string
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Projects
            </h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              <span>New Project</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-200 border border-gray-100">
                <div className="h-2 w-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-4"></div>
                <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                <p className="text-gray-600 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.LLMs.map((llm) => (
                    <span key={llm} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">
                      {llm}
                    </span>
                  ))}
                </div>
                <div className="text-sm text-gray-500 flex justify-between items-center">
                  <span>Evaluator: <span className="text-indigo-600">{project.Eval_LLM}</span></span>
                  <span className="text-gray-400">{formatDate(project.created_at)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md relative overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">New Project</h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="h-1 w-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mt-4"></div>
            </div>

            <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none h-24"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">System Prompt</label>
                <textarea
                  value={formData.system_prompt}
                  onChange={(e) => setFormData(prev => ({ ...prev, system_prompt: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none h-24"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select LLMs</label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {AVAILABLE_LLMS.map((llm) => (
                    <button
                      key={llm}
                      type="button"
                      onClick={() => toggleLLM(llm)}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium flex items-center justify-between ${
                        formData.LLMs.includes(llm)
                          ? 'border-blue-500 bg-blue-50 text-blue-600'
                          : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'
                      }`}
                    >
                      {llm}
                      {formData.LLMs.includes(llm) && <Check className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Evaluater LLM</label>
                <select
                  value={formData.Eval_LLM}
                  onChange={(e) => setFormData(prev => ({ ...prev, Eval_LLM: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  required
                >
                  <option value="">Select an LLM</option>
                  {AVAILABLE_LLMS.map((llm) => (
                    <option key={llm} value={llm}>{llm}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:opacity-90 transition-all duration-200"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDashboard;