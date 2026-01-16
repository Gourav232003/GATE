import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Filter, Edit2, Trash2, ChevronLeft, ChevronRight,
  X, Save, AlertCircle, CheckCircle, Upload, FileUp
} from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import PaperUploadModal from '../../components/PaperUploadModal';

function AdminQuestions() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState({ subjects: [], topics: {}, difficulties: [], years: [] });
  const [filters, setFilters] = useState({ subject: '', topic: '', difficulty: '', search: '' });
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [showModal, setShowModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [alert, setAlert] = useState(null);

  const emptyQuestion = {
    subject: '',
    topic: '',
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: '',
    difficulty: 'Medium',
    year: '',
    marks: 1,
    negativeMarks: 0.33
  };

  const [formData, setFormData] = useState(emptyQuestion);

  useEffect(() => {
    fetchOptions();
    fetchQuestions();
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, [filters, pagination.page]);

  const getToken = () => localStorage.getItem('adminToken');

  const fetchOptions = async () => {
    try {
      const response = await fetch('/api/admin/options', {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      const data = await response.json();
      setOptions(data);
    } catch (error) {
      console.error('Error fetching options:', error);
    }
  };

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page,
        limit: 10,
        ...(filters.subject && { subject: filters.subject }),
        ...(filters.topic && { topic: filters.topic }),
        ...(filters.difficulty && { difficulty: filters.difficulty }),
        ...(filters.search && { search: filters.search })
      });

      const response = await fetch(`/api/admin/questions?${params}`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      const data = await response.json();
      setQuestions(data.questions);
      setPagination(prev => ({ ...prev, totalPages: data.totalPages, total: data.total }));
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const url = editingQuestion 
        ? `/api/admin/questions/${editingQuestion.id}`
        : '/api/admin/questions';
      
      const method = editingQuestion ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setAlert({ type: 'success', message: editingQuestion ? 'Question updated!' : 'Question created!' });
      setShowModal(false);
      setEditingQuestion(null);
      setFormData(emptyQuestion);
      fetchQuestions();
    } catch (error) {
      setAlert({ type: 'error', message: error.message });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;

    try {
      const response = await fetch(`/api/admin/questions/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });

      if (!response.ok) throw new Error('Failed to delete');

      setAlert({ type: 'success', message: 'Question deleted!' });
      fetchQuestions();
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to delete question' });
    }
  };

  const openEditModal = (question) => {
    setEditingQuestion(question);
    setFormData({
      subject: question.subject,
      topic: question.topic,
      question: question.question,
      options: [...question.options],
      correctAnswer: question.correctAnswer,
      explanation: question.explanation || '',
      difficulty: question.difficulty,
      year: question.year || '',
      marks: question.marks,
      negativeMarks: question.negativeMarks
    });
    setShowModal(true);
  };

  const openNewModal = () => {
    setEditingQuestion(null);
    setFormData(emptyQuestion);
    setShowModal(true);
  };

  const handleImportedQuestions = async (questions) => {
    try {
      let successCount = 0;
      let failCount = 0;

      for (const q of questions) {
        try {
          const response = await fetch('/api/admin/questions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify({
              subject: q.subject,
              topic: q.topic,
              question: q.question,
              options: q.options,
              correctAnswer: q.correctAnswer,
              explanation: q.explanation || '',
              difficulty: q.difficulty,
              year: q.year || null,
              marks: q.marks || 1,
              negativeMarks: q.negativeMarks || 0.33
            })
          });

          if (response.ok) {
            successCount++;
          } else {
            failCount++;
          }
        } catch (err) {
          failCount++;
        }
      }

      setAlert({ 
        type: failCount === 0 ? 'success' : 'warning', 
        message: `Imported ${successCount} questions successfully${failCount > 0 ? `, ${failCount} failed` : ''}` 
      });
      fetchQuestions();
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to import questions' });
    }
  };

  const updateOption = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Alert */}
        {alert && (
          <div className={`p-4 rounded-lg flex items-center gap-2 ${
            alert.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {alert.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            {alert.message}
            <button onClick={() => setAlert(null)} className="ml-auto">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Question Management</h1>
            <p className="text-gray-600">Total: {pagination.total} questions</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-purple-200 text-purple-600 rounded-lg hover:bg-purple-50 transition-all"
            >
              <FileUp className="w-5 h-5" />
              Import Paper
            </button>
            <button
              onClick={openNewModal}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
            >
              <Plus className="w-5 h-5" />
              Add Question
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search questions..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <select
              value={filters.subject}
              onChange={(e) => setFilters({ ...filters, subject: e.target.value, topic: '' })}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Subjects</option>
              {options.subjects.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            <select
              value={filters.topic}
              onChange={(e) => setFilters({ ...filters, topic: e.target.value })}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={!filters.subject}
            >
              <option value="">All Topics</option>
              {filters.subject && options.topics[filters.subject]?.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
            <select
              value={filters.difficulty}
              onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Difficulties</option>
              {options.difficulties.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Questions Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          ) : questions.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No questions found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Question</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Topic</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Difficulty</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Year</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {questions.map(q => (
                    <tr key={q.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">#{q.id}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 max-w-md truncate">{q.question}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {options.subjects.find(s => s.value === q.subject)?.label || q.subject}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {options.topics[q.subject]?.find(t => t.value === q.topic)?.label || q.topic}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          q.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                          q.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {q.difficulty}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{q.year || '-'}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => openEditModal(q)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors inline-flex"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(q.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors inline-flex ml-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Page {pagination.page} of {pagination.totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                  className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page === pagination.totalPages}
                  className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-gray-900">
                {editingQuestion ? 'Edit Question' : 'Add New Question'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Subject & Topic */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value, topic: '' })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value="">Select Subject</option>
                    {options.subjects.map(s => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Topic *</label>
                  <select
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    disabled={!formData.subject}
                    required
                  >
                    <option value="">Select Topic</option>
                    {formData.subject && options.topics[formData.subject]?.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Question */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Question *</label>
                <textarea
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={3}
                  required
                />
              </div>

              {/* Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Options * (Select correct answer)</label>
                <div className="space-y-3">
                  {formData.options.map((opt, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="correctAnswer"
                        checked={formData.correctAnswer === index}
                        onChange={() => setFormData({ ...formData, correctAnswer: index })}
                        className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-sm font-medium text-gray-500 w-6">{String.fromCharCode(65 + index)}.</span>
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => updateOption(index, e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder={`Option ${String.fromCharCode(65 + index)}`}
                        required
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Explanation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Explanation</label>
                <textarea
                  value={formData.explanation}
                  onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={3}
                  placeholder="Explain why the correct answer is correct..."
                />
              </div>

              {/* Difficulty, Year, Marks */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {options.difficulties.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year (PYQ)</label>
                  <select
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Not a PYQ</option>
                    {options.years.map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Marks</label>
                  <input
                    type="number"
                    value={formData.marks}
                    onChange={(e) => setFormData({ ...formData, marks: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    min={0}
                    step={0.5}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Negative Marks</label>
                  <input
                    type="number"
                    value={formData.negativeMarks}
                    onChange={(e) => setFormData({ ...formData, negativeMarks: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    min={0}
                    step={0.01}
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 sticky bottom-0 bg-white">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {editingQuestion ? 'Update' : 'Create'} Question
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Paper Upload Modal */}
      <PaperUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onQuestionsExtracted={handleImportedQuestions}
        options={options}
      />
    </AdminLayout>
  );
}

export default AdminQuestions;
