'use client'

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Clock, Beaker, Target } from 'lucide-react';

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [scores, setScores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [analyticsResponse, scoresResponse] = await Promise.all([
        fetch('https://5000-idx-llm-evaluation-1735645177260.cluster-rcyheetymngt4qx5fpswua3ry4.cloudworkstations.dev/analytics'),
        fetch('https://5000-idx-llm-evaluation-1735645177260.cluster-rcyheetymngt4qx5fpswua3ry4.cloudworkstations.dev/scores')
      ]);
      
      const analyticsData = await analyticsResponse.json();
      const scoresData = await scoresResponse.json();
      
      setAnalytics(analyticsData);
      setScores(scoresData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatChartData = (scores) => {
    return scores.map((score, index) => ({
      index: index + 1,
      score: score < 1 ? score * 100 : score
    }));
  };

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color.replace('text-', 'bg-')} bg-opacity-10`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500">Overview of your LLM evaluation metrics</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Responses"
            value={analytics.responseCount.toLocaleString()}
            icon={Activity}
            color="text-blue-600"
          />
          <StatCard
            title="Total Experiments"
            value={analytics.experimentsCount.toLocaleString()}
            icon={Beaker}
            color="text-purple-600"
          />
          <StatCard
            title="Avg Response Time"
            value={`${analytics.avgResponseTime.toFixed(2)}ms`}
            icon={Clock}
            color="text-green-600"
          />
          <StatCard
            title="Average Score"
            value={`${analytics.avgScore.toFixed(1)}%`}
            icon={Target}
            color="text-rose-600"
          />
        </div>

        {/* Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Score Distribution</h2>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={formatChartData(scores)} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="index" 
                  label={{ value: 'Evaluation Number', position: 'insideBottom', offset: -5 }}
                />
                <YAxis
                  domain={[0, 100]}
                  label={{ value: 'Score (%)', angle: -90, position: 'insideLeft', offset: 10 }}
                />
                <Tooltip
                  contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  formatter={(value) => [`${value}%`, 'Score']}
                  labelFormatter={(value) => `Evaluation #${value}`}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#4f46e5"
                  strokeWidth={2}
                  dot={{ fill: '#4f46e5', strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: '#4f46e5' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}