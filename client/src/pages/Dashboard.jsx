import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen,
  ClipboardList,
  Trophy,
  TrendingUp,
  Clock,
  Target,
  Calendar,
  ArrowRight,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

const recentActivity = [
  { id: 1, type: 'practice', subject: 'Data Structures', score: 85, total: 100, date: '2 hours ago' },
  { id: 2, type: 'test', subject: 'Mock Test #12', score: 72, total: 100, date: 'Yesterday' },
  { id: 3, type: 'practice', subject: 'Computer Networks', score: 90, total: 100, date: '2 days ago' },
];

const upcomingGoals = [
  { id: 1, title: 'Complete OS chapter', deadline: 'Jan 20', progress: 65 },
  { id: 2, title: 'Solve 50 DBMS questions', deadline: 'Jan 25', progress: 40 },
  { id: 3, title: 'Take Mock Test #13', deadline: 'Jan 18', progress: 0 },
];

function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [performanceData, setPerformanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard/stats', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setStats(data.stats);
      setPerformanceData(data.performanceData || []);
      setIsNewUser(data.isNewUser || false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setStats(null);
      setPerformanceData([]);
      setIsNewUser(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Welcome{isNewUser ? '' : ' back'}, {user?.name?.split(' ')[0]}! 👋</h1>
            <p className="text-primary-100 mt-1">
              {isNewUser 
                ? "Start your GATE preparation journey today!" 
                : stats?.streak > 0 
                  ? `You're on a ${stats.streak} day streak! Keep up the great work.`
                  : "Let's continue your preparation!"}
            </p>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold">{stats?.rank || '--'}</p>
              <p className="text-xs text-primary-100">Your Rank</p>
            </div>
            <div className="w-px h-12 bg-primary-400"></div>
            <div className="text-center">
              <p className="text-3xl font-bold">{stats?.averageScore || 0}%</p>
              <p className="text-xs text-primary-100">Avg Score</p>
            </div>
          </div>
        </div>
      </div>

      {/* New User Getting Started Section */}
      {isNewUser && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-blue-800 mb-3">🚀 Get Started with Your Preparation</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link to="/question-bank" className="bg-white p-4 rounded-lg border border-blue-100 hover:shadow-md transition-shadow">
              <BookOpen className="w-8 h-8 text-blue-500 mb-2" />
              <h3 className="font-medium text-gray-800">Practice Questions</h3>
              <p className="text-sm text-gray-500">Start solving topic-wise questions</p>
            </Link>
            <Link to="/mock-tests" className="bg-white p-4 rounded-lg border border-blue-100 hover:shadow-md transition-shadow">
              <ClipboardList className="w-8 h-8 text-green-500 mb-2" />
              <h3 className="font-medium text-gray-800">Take a Mock Test</h3>
              <p className="text-sm text-gray-500">Test yourself with full-length exams</p>
            </Link>
            <Link to="/syllabus" className="bg-white p-4 rounded-lg border border-blue-100 hover:shadow-md transition-shadow">
              <Target className="w-8 h-8 text-purple-500 mb-2" />
              <h3 className="font-medium text-gray-800">View Syllabus</h3>
              <p className="text-sm text-gray-500">Plan your study schedule</p>
            </Link>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={BookOpen}
          label="Questions Attempted"
          value={stats?.questionsAttempted || 0}
          color="blue"
        />
        <StatCard
          icon={ClipboardList}
          label="Tests Completed"
          value={stats?.testsCompleted || 0}
          color="green"
        />
        <StatCard
          icon={Target}
          label="Average Accuracy"
          value={`${stats?.averageScore || 0}%`}
          color="purple"
        />
        <StatCard
          icon={Clock}
          label="Study Hours"
          value={stats?.studyHours || 0}
          color="orange"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Performance Chart */}
        <div className="md:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Performance Trend</h2>
          <div className="h-64">
            {performanceData && performanceData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorScore)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <TrendingUp className="w-12 h-12 mb-3" />
                <p className="text-sm">No performance data yet</p>
                <p className="text-xs">Complete tests to see your progress</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              to="/mock-tests"
              className="flex items-center gap-3 p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors group"
            >
              <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
                <ClipboardList size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">Take Mock Test</p>
                <p className="text-xs text-gray-500">Simulate real exam</p>
              </div>
              <ArrowRight size={16} className="text-gray-400 group-hover:text-primary-500 transition-colors" />
            </Link>

            <Link
              to="/question-bank"
              className="flex items-center gap-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors group"
            >
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <BookOpen size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">Practice Questions</p>
                <p className="text-xs text-gray-500">Topic-wise practice</p>
              </div>
              <ArrowRight size={16} className="text-gray-400 group-hover:text-green-500 transition-colors" />
            </Link>

            <Link
              to="/pyqs"
              className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors group"
            >
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <Trophy size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">Previous Year Papers</p>
                <p className="text-xs text-gray-500">10+ years PYQs</p>
              </div>
              <ArrowRight size={16} className="text-gray-400 group-hover:text-purple-500 transition-colors" />
            </Link>

            <Link
              to="/notes"
              className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors group"
            >
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <TrendingUp size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">Revision Notes</p>
                <p className="text-xs text-gray-500">Quick revision</p>
              </div>
              <ArrowRight size={16} className="text-gray-400 group-hover:text-orange-500 transition-colors" />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity & Goals */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    activity.type === 'test' ? 'bg-blue-100' : 'bg-green-100'
                  }`}
                >
                  {activity.type === 'test' ? (
                    <ClipboardList size={18} className="text-blue-600" />
                  ) : (
                    <BookOpen size={18} className="text-green-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{activity.subject}</p>
                  <p className="text-xs text-gray-500">{activity.date}</p>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${activity.score >= 75 ? 'text-green-600' : 'text-orange-500'}`}>
                    {activity.score}/{activity.total}
                  </p>
                  <p className="text-xs text-gray-500">{activity.score}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Goals */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Goals</h2>
          <div className="space-y-4">
            {upcomingGoals.map((goal) => (
              <div key={goal.id} className="p-3 border border-gray-100 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-gray-800">{goal.title}</p>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar size={12} />
                    {goal.deadline}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        goal.progress >= 75 ? 'bg-green-500' : goal.progress >= 50 ? 'bg-blue-500' : 'bg-orange-500'
                      }`}
                      style={{ width: `${goal.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-600">{goal.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <div className={`w-10 h-10 rounded-lg ${colors[color]} flex items-center justify-center mb-3`}>
        <Icon size={20} />
      </div>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}

export default Dashboard;
