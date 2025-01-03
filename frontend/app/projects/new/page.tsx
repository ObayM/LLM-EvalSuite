'use client'
import React, { useState } from 'react';
import { ArrowLeft, Check, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ProjectFormData {
  title: string;
  description: string;
  system_prompt: string;
  LLMs: string[];
  Eval_LLM: string;
}

const AVAILABLE_LLMS = [
    "gemini-1.5-flash",
    "gemini-2.0-flash-exp",
    "gemini-1.5-flash-8b",
    "gemini-1.5-pro",
    "llama-3.1-8b-instant",
    "llama-3.3-70b-versatile",
    "mixtral-8x7b-32768"
];


const NewProjectPage: React.FC = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    description: '',
    system_prompt: '',
    LLMs: [],
    Eval_LLM: ''
  });

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
    setIsSubmitting(true);
    
    try {
      const response = await fetch('https://5000-idx-llm-evaluation-1735645177260.cluster-rcyheetymngt4qx5fpswua3ry4.cloudworkstations.dev/new-project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        router.push('/projects');
      }
    } catch (error) {
      console.error('Error creating project:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link 
                href="/projects"
                className="p-2 hover:bg-gray-50 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">New Project</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">Project Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="text-black w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                placeholder="Enter project title"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="text-black  w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all resize-none h-24"
                placeholder="Describe your project"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">System Prompt</label>
              <textarea
                value={formData.system_prompt}
                onChange={(e) => setFormData(prev => ({ ...prev, system_prompt: e.target.value }))}
                className="text-black w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all resize-none h-32"
                placeholder="Enter system prompt"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">Select LLMs</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {AVAILABLE_LLMS.map((llm) => (
                  <button
                    key={llm}
                    type="button"
                    onClick={() => toggleLLM(llm)}
                    className={`text-black px-4 py-2.5 rounded-xl border text-sm font-medium flex items-center justify-between transition-all ${
                      formData.LLMs.includes(llm)
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-600'
                        : 'border-gray-200 hover:border-indigo-500 hover:bg-indigo-50'
                    }`}
                  >
                    {llm}
                    {formData.LLMs.includes(llm) && <Check className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">Evaluator LLM</label>
              <select
                value={formData.Eval_LLM}
                onChange={(e) => setFormData(prev => ({ ...prev, Eval_LLM: e.target.value }))}
                className="text-black w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                required
              >
                <option value="">Select an LLM</option>
                {AVAILABLE_LLMS.map((llm) => (
                  <option key={llm} value={llm}>{llm}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-end gap-4 pt-4">
              <Link
                href="/projects"
                className="text-black px-6 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Creating...' : 'Create Project'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewProjectPage;