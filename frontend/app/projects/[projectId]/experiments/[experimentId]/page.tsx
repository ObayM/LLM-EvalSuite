'use client'

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, RotateCw } from 'lucide-react';
import Link from 'next/link';

interface Experiment {
  id: number;
  title: string;
  description?: string;
  Eval_criteria: string;
  prompt: string;
  expected_out: string;
  project_id: number;
}

interface Project {
  id: number;
  title: string;
  system_prompt: string;
  LLMs: string[];
  Eval_LLM: string;
}

interface LLMResponse {
  llm: string;
  responseTime: number;
  response: string;
}

interface Evaluation {
  llm: string;
  responseTime: number;
  score: number;
  comments: string;
}
export default function ExperimentPage({ params }) {
  const unwrappedParams = React.use(params);
  const experimentId = parseInt(unwrappedParams.experimentId);
  const projectId = parseInt(unwrappedParams.projectId);

  const [experiment, setExperiment] = useState<Experiment | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [currentResponse, setCurrentResponse] = useState<{ id: string, LLM_Responses: LLMResponse[] } | null>(null);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);

  useEffect(() => {
    fetchData();
  }, [experimentId]);

  const fetchData = async () => {
    try {
      // Fetch experiment data
      const expResponse = await fetch(`https://5000-idx-llm-evaluation-1735645177260.cluster-rcyheetymngt4qx5fpswua3ry4.cloudworkstations.dev/expirments?project_id=${projectId}`);
      const experiments = await expResponse.json();
      const exp = experiments.find(e => e.id === experimentId);
      setExperiment(exp);

      // Fetch project data
      const projResponse = await fetch(`https://5000-idx-llm-evaluation-1735645177260.cluster-rcyheetymngt4qx5fpswua3ry4.cloudworkstations.dev/project?id=${projectId}`);
      const projData = await projResponse.json();
      setProject(projData);

      // Fetch existing response
      const responseResponse = await fetch(`https://5000-idx-llm-evaluation-1735645177260.cluster-rcyheetymngt4qx5fpswua3ry4.cloudworkstations.dev/response?experiment_id=${experimentId}`);
      const responses = await responseResponse.json();
      
      if (responses.length > 0) {
        const latestResponse = responses[responses.length - 1]; // Get most recent response
        setCurrentResponse(latestResponse);

        // Fetch existing evaluations for this response
        const evaluationsResponse = await fetch(`https://5000-idx-llm-evaluation-1735645177260.cluster-rcyheetymngt4qx5fpswua3ry4.cloudworkstations.dev/evaluations?response_id=${latestResponse.id}`);
        const evaluationsData = await evaluationsResponse.json();
        setEvaluations(evaluationsData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchExperimentData = async () => {
    try {
      const response = await fetch(`https://5000-idx-llm-evaluation-1735645177260.cluster-rcyheetymngt4qx5fpswua3ry4.cloudworkstations.dev/expirments?project_id=${projectId}`);
      const experiments = await response.json();
      const exp = experiments.find(e => e.id === experimentId);
      setExperiment(exp);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching experiment:', error);
    }
  };

  const generateResponses = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('https://5000-idx-llm-evaluation-1735645177260.cluster-rcyheetymngt4qx5fpswua3ry4.cloudworkstations.dev/new_response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ experiment_id: experimentId }),
      });
      const data = await response.json();
      setCurrentResponse(data);
    } catch (error) {
      console.error('Error generating responses:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const evaluateResponses = async () => {
    if (!currentResponse) return;
    
    setIsEvaluating(true);
    try {
      const response = await fetch('https://5000-idx-llm-evaluation-1735645177260.cluster-rcyheetymngt4qx5fpswua3ry4.cloudworkstations.dev/new_evaluation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ response_id: currentResponse.id }),
      });
      const data = await response.json();
      setEvaluations(data);
    } catch (error) {
      console.error('Error evaluating responses:', error);
    } finally {
      setIsEvaluating(false);
    }
  };
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - System & Experiment Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">System Prompt</h2>
                <p className="text-gray-600 whitespace-pre-wrap">{project?.system_prompt}</p>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-4">Experiment Info</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Title</h3>
                    <p className="mt-1">{experiment?.title}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Description</h3>
                    <p className="mt-1">{experiment?.description || 'No description provided'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Prompt</h3>
                    <p className="mt-1 whitespace-pre-wrap">{experiment?.prompt}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Evaluation Criteria</h3>
                    <p className="mt-1">{experiment?.Eval_criteria}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Center & Right Columns - Responses & Evaluations */}
          <div className="lg:col-span-2 space-y-6">
            {/* Controls - Only show if no responses exist */}
            {!currentResponse && (
              <div className="flex gap-4">
                <button
                  onClick={generateResponses}
                  disabled={isGenerating}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  <Play className="w-4 h-4" />
                  {isGenerating ? 'Generating...' : 'Generate Responses'}
                </button>
              </div>
            )}

            {/* Show evaluate button only if we have responses but no evaluations */}
            {currentResponse && evaluations.length === 0 && (
              <div className="flex gap-4">
                <button
                  onClick={evaluateResponses}
                  disabled={isEvaluating}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  <RotateCw className="w-4 h-4" />
                  {isEvaluating ? 'Evaluating...' : 'Evaluate Responses'}
                </button>
              </div>
            )}

            {/* LLM Responses */}
            {currentResponse && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentResponse.LLM_Responses.map((response, index) => (
                  <div key={index} className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium text-gray-900">{response.llm}</h3>
                      <span className="text-sm text-gray-500">{response.responseTime.toFixed(2)}ms</span>
                    </div>
                    <p className="text-gray-600 whitespace-pre-wrap">{response.response}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Evaluations */}
            {evaluations.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Evaluation Results</h2>
                <div className="space-y-4">
                  {evaluations.map((evaluation, index) => (
                    <div key={index} className="border-b last:border-0 pb-4 last:pb-0">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium text-gray-900">{evaluation.llm}</h3>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-gray-500">{evaluation.responseTime.toFixed(2)}s</span>
                          <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium">
                            Score: {evaluation.score.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-600">{evaluation.comments}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}