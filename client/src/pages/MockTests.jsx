import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, Target, Trophy, Play, Calendar, Filter, Loader2, BookOpen } from 'lucide-react';

function MockTests() {
  const [tests, setTests] = useState([]);
  const [userTestHistory, setUserTestHistory] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const [testsRes, historyRes] = await Promise.all([
        fetch('/api/tests'),
        fetch('/api/user/test-history', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }),
      ]);
      
      const testsData = await testsRes.json();
      setTests(testsData);
      
      if (historyRes.ok) {
        const historyData = await historyRes.json();
        setUserTestHistory(historyData || []);
      }
    } catch (error) {
      console.error('Error fetching tests:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTests = tests.filter((test) => {
    if (filter === 'all') return true;
    return test.type === filter;
  });

  const getCompletedTest = (testId) => {
    return userTestHistory.find((h) => h.testId === testId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  const hasCompletedTests = userTestHistory.length > 0;
  const avgScore = hasCompletedTests
    ? Math.round(userTestHistory.reduce((a, b) => a + b.score, 0) / userTestHistory.length)
    : null;
  const bestRank = hasCompletedTests ? Math.min(...userTestHistory.map((h) => h.rank)) : null;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Mock Tests</h1>
          <p className="text-gray-500">Practice with full-length tests that simulate the real GATE exam</p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-gray-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
          >
            <option value="all">All Tests</option>
            <option value="full">Full Length</option>
            <option value="sectional">Sectional</option>
            <option value="mini">Mini Tests</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-2xl font-bold text-primary-600">{tests.length}</p>
          <p className="text-sm text-gray-500">Total Tests</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-2xl font-bold text-green-600">{hasCompletedTests ? userTestHistory.length : '--'}</p>
          <p className="text-sm text-gray-500">Completed</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-2xl font-bold text-purple-600">
            {avgScore !== null ? `${avgScore}%` : '--'}
          </p>
          <p className="text-sm text-gray-500">Avg Score</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-2xl font-bold text-orange-600">
            {bestRank !== null ? `#${bestRank}` : '--'}
          </p>
          <p className="text-sm text-gray-500">Best Rank</p>
        </div>
      </div>

      {/* Tests Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredTests.map((test) => {
          const completed = getCompletedTest(test.id);
          return (
            <div
              key={test.id}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              {/* Test Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        test.type === 'full'
                          ? 'bg-purple-100 text-purple-700'
                          : test.type === 'sectional'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {test.type === 'full'
                        ? 'Full Length'
                        : test.type === 'sectional'
                        ? 'Sectional'
                        : 'Mini Test'}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        test.difficulty === 'Easy'
                          ? 'bg-green-100 text-green-700'
                          : test.difficulty === 'Medium'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {test.difficulty}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">{test.title}</h3>
                </div>
                {completed && (
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">{completed.score}%</p>
                    <p className="text-xs text-gray-500">Rank #{completed.rank}</p>
                  </div>
                )}
              </div>

              <p className="text-sm text-gray-500 mb-4">{test.description}</p>

              {/* Test Info */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <Clock size={16} className="text-gray-400" />
                  {test.duration} mins
                </div>
                <div className="flex items-center gap-1">
                  <Target size={16} className="text-gray-400" />
                  {test.questions} Qs
                </div>
                <div className="flex items-center gap-1">
                  <Trophy size={16} className="text-gray-400" />
                  {test.marks} marks
                </div>
                <div className="flex items-center gap-1">
                  <Users size={16} className="text-gray-400" />
                  {test.attempts.toLocaleString()} attempts
                </div>
              </div>

              {/* Average Score */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-500">Average Score</span>
                  <span className="font-medium text-gray-700">{test.avgScore}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-500"
                    style={{ width: `${test.avgScore}%` }}
                  ></div>
                </div>
              </div>

              {/* Action Button */}
              <Link
                to={`/test/${test.id}`}
                className="w-full flex items-center justify-center gap-2 py-3 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition-colors"
              >
                <Play size={18} />
                {completed ? 'Retake Test' : 'Start Test'}
              </Link>
            </div>
          );
        })}
      </div>

      {filteredTests.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl">
          <Clock size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600">No tests found</h3>
          <p className="text-gray-500">Try adjusting your filter</p>
        </div>
      )}
    </div>
  );
}

export default MockTests;
