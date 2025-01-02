'use client'
import React, { useState, useEffect } from 'react';
import { Plus, ChevronRight, Calendar, Users } from 'lucide-react';
import Link from 'next/link';

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

const ProjectsDashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
            <Link 
              href="/projects/new" 
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors duration-200 font-medium shadow-lg shadow-indigo-100"
            >
              <Plus className="w-5 h-5" />
              Create Project
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {projects.map((project) => (
              <div 
                key={project.id} 
                className="bg-white rounded-2xl border border-gray-100 hover:border-indigo-100 shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden group"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h2 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                        {project.title}
                      </h2>
                      <p className="text-gray-600">{project.description}</p>
                    </div>
                    <button className="p-2 rounded-full hover:bg-gray-50 transition-colors">
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                    </button>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.LLMs.map((llm) => (
                      <span 
                        key={llm}
                        className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-sm font-medium"
                      >
                        {llm}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Calendar className="w-4 h-4" />
                      {formatDate(project.created_at)}
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <Users className="w-4 h-4" />
                      Evaluator: <span className="text-indigo-600 font-medium">{project.Eval_LLM}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsDashboard;