import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { Target, Award, Clock, AlertTriangle, BookOpen, Play, Loader2 } from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#14b8a6'];

function Analytics() {
  const [loading, setLoading] = useState(true);
  const [hasData, setHasData] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [timeRange, setTimeRange] = useState('month');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setHasData(data.hasData);
      if (data.hasData) {
        setAnalyticsData(data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setHasData(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  if (!hasData) {
    return (
      <div className="space-y-6 animate-fadeIn">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Performance Analytics</h1>
          <p className="text-gray-500">Track your progress and identify areas for improvement</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Target className="w-10 h-10 text-blue-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">No Analytics Data Yet</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Start practicing questions and taking mock tests to see your performance analytics here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/question-bank"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              <BookOpen className="w-5 h-5" />
              Practice Questions
            </Link>
            <Link
              to="/mock-tests"
              className="flex items-center justify-center gap-2 px-6 py-3 border border-primary-500 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
            >
              <Play className="w-5 h-5" />
              Take a Mock Test
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { subjectPerformance, weeklyProgress, difficultyBreakdown, weakAreas, recentTests, stats } = analyticsData;

  const radarData = subjectPerformance.map(s => ({
    subject: s.subject.split(' ')[0].substring(0, 4),
    A: s.score,
    fullMark: 100
  }));

  const coloredSubjectPerformance = subjectPerformance.map((s, i) => ({
    ...s,
    color: COLORS[i % COLORS.length]
  }));

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Performance Analytics</h1>
          <p className="text-gray-500">Track your progress and identify areas for improvement</p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
        >
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
          <option value="quarter">Last 3 Months</option>
          <option value="all">All Time</option>
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Target} label="Overall Accuracy" value={`${stats.overallAccuracy}%`} />
        <StatCard icon={Award} label="Questions Solved" value={stats.totalQuestions.toLocaleString()} />
        <StatCard icon={Clock} label="Study Hours" value={stats.studyHours} />
        <StatCard icon={AlertTriangle} label="Weak Topics" value={stats.weakTopicsCount} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Subject-wise Performance</h2>
          <div className="h-80">
            {coloredSubjectPerformance.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={coloredSubjectPerformance} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <YAxis dataKey="subject" type="category" tick={{ fontSize: 11 }} width={80} stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} 
                    formatter={(value) => [`${value}%`, 'Accuracy']} 
                  />
                  <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                    {coloredSubjectPerformance.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                <p>No subject data yet</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Skill Radar</h2>
          <div className="h-80">
            {radarData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <Radar name="Performance" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                <p>No skill data yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Weekly Progress</h2>
          <div className="h-64">
            {weeklyProgress.some(w => w.questions > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyProgress}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <YAxis yAxisId="left" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                  <Line yAxisId="left" type="monotone" dataKey="questions" stroke="#3b82f6" strokeWidth={2} name="Questions" />
                  <Line yAxisId="right" type="monotone" dataKey="accuracy" stroke="#10b981" strokeWidth={2} name="Accuracy %" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                <p>No weekly progress data yet</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Difficulty Distribution</h2>
          <div className="h-64">
            {difficultyBreakdown.some(d => d.value > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={difficultyBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                    {difficultyBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                <p>No difficulty data yet</p>
              </div>
            )}
          </div>
          <div className="flex justify-center gap-4 mt-4">
            {difficultyBreakdown.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm text-gray-600">{item.name} ({item.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            <span className="flex items-center gap-2">
              <AlertTriangle size={20} className="text-orange-500" />
              Areas Needing Improvement
            </span>
          </h2>
          {weakAreas.length > 0 ? (
            <div className="space-y-4">
              {weakAreas.map((area, index) => (
                <div key={index} className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-gray-800">{area.topic}</h3>
                    <span className="text-sm font-medium text-orange-600">{area.accuracy}%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-orange-100 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-500 rounded-full" style={{ width: `${area.accuracy}%` }}></div>
                    </div>
                    <span className="text-xs text-gray-500">{area.questionsAttempted} attempted</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No weak areas identified yet</p>
              <p className="text-sm">Keep practicing to get personalized insights</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Test Performance</h2>
          {recentTests.length > 0 ? (
            <div className="space-y-3">
              {recentTests.map((test) => (
                <div key={test.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-800">{test.name}</h3>
                    <p className="text-sm text-gray-500">{new Date(test.date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary-600">{test.score}%</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <Award className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No tests completed yet</p>
              <Link to="/mock-tests" className="text-primary-500 text-sm hover:underline">
                Take your first mock test →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
          <Icon size={20} className="text-primary-600" />
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}

export default Analytics;
