'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CreateExperimentPage({ params }) {
  const unwrappedParams = React.use(params);
  const projectId = unwrappedParams.projectId;
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    Eval_criteria: '',
    prompt: '',
    expected_out: ''
  });

  const EvaluationCriterias = [
    "accuracy",
    "llm_evaluator"
  ]


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('https://5000-idx-llm-evaluation-1735645177260.cluster-rcyheetymngt4qx5fpswua3ry4.cloudworkstations.dev/new_expirment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          project_id: parseInt(projectId),
          ...formData
        }),
        credentials: 'include'
      });

      if (response.ok) {
        router.push(`/projects/${projectId}/`);
      } else {
        throw new Error('Failed to create experiment');
      }
    } catch (error) {
      console.error('Error creating experiment:', error);
      alert('Failed to create experiment. Please try again.');
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
            <div className="flex items-center">
              <Link 
                href={`/projects/${projectId}/`}
                className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Experiments
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Experiment</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                placeholder="Enter experiment title"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                placeholder="Enter experiment description"
              />
            </div>

            <div>
              <label htmlFor="Eval_criteria" className="block text-sm font-medium text-gray-700 mb-1">
                Evaluation Criteria
              </label>
              <select
                value={formData.Eval_criteria}
                onChange={(e) => setFormData(prev => ({ ...prev, Eval_criteria: e.target.value }))}
                className="text-black w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                required
              >
                <option value="">Select an Evaluation Criteria</option>
                {EvaluationCriterias.map((eval_criteria) => (
                  <option key={eval_criteria} value={eval_criteria}>{eval_criteria}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-1">
                Prompt
              </label>
              <textarea
                id="prompt"
                name="prompt"
                required
                value={formData.prompt}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                placeholder="Enter experiment prompt"
              />
            </div>

            <div>
              <label htmlFor="expected_out" className="block text-sm font-medium text-gray-700 mb-1">
                Expected Output
              </label>
              <textarea
                id="expected_out"
                name="expected_out"
                required
                value={formData.expected_out}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                placeholder="Enter expected output"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Creating...' : 'Create Experiment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}