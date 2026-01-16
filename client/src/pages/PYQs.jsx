import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Filter, Clock, CheckCircle, ArrowRight, BookOpen, Trophy, Loader2 } from 'lucide-react';

function PYQs() {
  const [viewMode, setViewMode] = useState('year');
  const [pyqYears, setPyqYears] = useState([]);
  const [topicWisePYQ, setTopicWisePYQ] = useState([]);
  const [completedYears, setCompletedYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalYears: 0, totalQuestions: 0, completedYears: 0, avgScore: 0 });

  useEffect(() => {
    fetchPYQs();
  }, []);

  const fetchPYQs = async () => {
    try {
      const [pyqRes, historyRes] = await Promise.all([
        fetch('/api/pyqs'),
        fetch('/api/user/pyq-history', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }),
      ]);
      
      const pyqData = await pyqRes.json();
      setPyqYears(pyqData.years || []);
      setTopicWisePYQ(pyqData.topics || []);
      setStats(pyqData.stats || { totalYears: 0, totalQuestions: 0, completedYears: 0, avgScore: 0 });
      
      if (historyRes.ok) {
        const historyData = await historyRes.json();
        setCompletedYears(historyData.completedYears || []);
      }
    } catch (error) {
      console.error('Error fetching PYQs:', error);
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

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Previous Year Questions</h1>
          <p className="text-gray-500">Practice with 10+ years of GATE CS questions with detailed solutions</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('year')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'year' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500'
              }`}
            >
              By Year
            </button>
            <button
              onClick={() => setViewMode('topic')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'topic' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500'
              }`}
            >
              By Topic
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-5">
          <p className="text-2xl font-bold text-primary-600">{stats.totalYears || pyqYears.length}</p>
          <p className="text-sm text-gray-500">Years of PYQs</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5">
          <p className="text-2xl font-bold text-green-600">
            {stats.totalQuestions || pyqYears.reduce((acc, y) => acc + y.questions, 0)}
          </p>
          <p className="text-sm text-gray-500">Total Questions</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5">
          <p className="text-2xl font-bold text-purple-600">{completedYears.length || '--'}</p>
          <p className="text-sm text-gray-500">Years Completed</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5">
          <p className="text-2xl font-bold text-orange-600">
            {stats.avgScore ? `${stats.avgScore}%` : '--'}
          </p>
          <p className="text-sm text-gray-500">Avg Score</p>
        </div>
      </div>

      {/* View by Year */}
      {viewMode === 'year' && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pyqYears.map((pyq) => {
            const isCompleted = completedYears.includes(pyq.year);
            return (
              <div
                key={pyq.year}
                className={`bg-white rounded-xl shadow-sm p-6 border-2 transition-all ${
                  isCompleted ? 'border-green-200' : 'border-transparent hover:border-primary-200'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                      <Calendar size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">GATE {pyq.year}</h3>
                      <p className="text-sm text-gray-500">{pyq.questions} Questions</p>
                    </div>
                  </div>
                  {isCompleted && (
                    <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full">
                      <CheckCircle size={14} />
                      <span className="text-xs font-medium">Done</span>
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-500">Average Score</span>
                    <span className="font-medium text-gray-700">{pyq.avgScore}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-500 rounded-full"
                      style={{ width: `${pyq.avgScore}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link
                    to={`/practice/pyq/${pyq.year}`}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium"
                  >
                    <BookOpen size={16} />
                    {isCompleted ? 'Practice Again' : 'Start Practice'}
                  </Link>
                  <Link
                    to={`/test/pyq-${pyq.year}`}
                    className="flex items-center justify-center gap-2 py-2 px-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
                  >
                    <Clock size={16} />
                    Timed
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View by Topic */}
      {viewMode === 'topic' && (
        <div className="space-y-4">
          {topicWisePYQ.map((topic) => (
            <div
              key={topic.topic}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Trophy size={24} className="text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{topic.topic}</h3>
                    <p className="text-sm text-gray-500">
                      {topic.count} questions from {topic.years}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right hidden md:block">
                    <p className="text-2xl font-bold text-primary-600">{topic.count}</p>
                    <p className="text-xs text-gray-500">Questions</p>
                  </div>
                  <Link
                    to={`/practice/pyq-topic/${topic.topic.toLowerCase().replace(/\s+/g, '-')}`}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium"
                  >
                    Practice
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-700 rounded-xl p-6 text-white">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <Trophy size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold mb-1">Why Practice PYQs?</h3>
            <p className="text-purple-100 text-sm">
              Previous year questions are crucial for GATE preparation. They help you understand the
              exam pattern, identify frequently asked topics, and improve time management. Studies
              show that 30-40% of GATE questions are repeated concepts from previous years!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PYQs;
