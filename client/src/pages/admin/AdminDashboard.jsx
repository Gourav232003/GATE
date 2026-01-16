import React, { useState, useEffect } from 'react';
import { 
  FileQuestion, ClipboardList, Users, TrendingUp, 
  Activity, BookOpen, BarChart2 
} from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = stats ? [
    { icon: FileQuestion, label: 'Total Questions', value: stats.totalQuestions, color: 'from-blue-500 to-blue-600' },
    { icon: ClipboardList, label: 'Total Tests', value: stats.totalTests, color: 'from-green-500 to-green-600' },
    { icon: Users, label: 'Registered Users', value: stats.totalUsers, color: 'from-purple-500 to-purple-600' },
    { icon: Activity, label: 'Total Attempts', value: stats.totalAttempts, color: 'from-orange-500 to-orange-600' },
  ] : [];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome to GATE Prep Pro administration panel</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Subject Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-purple-500" />
              Questions by Subject
            </h2>
            <div className="space-y-3">
              {stats?.subjectBreakdown?.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{item.subject}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                        style={{ width: `${(item.count / stats.totalQuestions) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8 text-right">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <a 
                href="/admin/questions?action=new"
                className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100 hover:border-purple-300 transition-colors group"
              >
                <FileQuestion className="w-8 h-8 text-purple-500 mb-2 group-hover:scale-110 transition-transform" />
                <p className="font-medium text-gray-900">Add Question</p>
                <p className="text-xs text-gray-500">Create new question</p>
              </a>
              <a 
                href="/admin/tests?action=new"
                className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100 hover:border-green-300 transition-colors group"
              >
                <ClipboardList className="w-8 h-8 text-green-500 mb-2 group-hover:scale-110 transition-transform" />
                <p className="font-medium text-gray-900">Create Test</p>
                <p className="text-xs text-gray-500">Set up new mock test</p>
              </a>
              <a 
                href="/admin/questions"
                className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100 hover:border-blue-300 transition-colors group"
              >
                <BookOpen className="w-8 h-8 text-blue-500 mb-2 group-hover:scale-110 transition-transform" />
                <p className="font-medium text-gray-900">View All</p>
                <p className="text-xs text-gray-500">Manage questions</p>
              </a>
              <a 
                href="/admin/users"
                className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-100 hover:border-orange-300 transition-colors group"
              >
                <Users className="w-8 h-8 text-orange-500 mb-2 group-hover:scale-110 transition-transform" />
                <p className="font-medium text-gray-900">Users</p>
                <p className="text-xs text-gray-500">View all users</p>
              </a>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-500" />
            Recent Activity
          </h2>
          {stats?.recentActivity?.length > 0 ? (
            <div className="space-y-3">
              {stats.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      User #{activity.userId} attempted Question #{activity.questionId}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.date).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No recent activity</p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;
