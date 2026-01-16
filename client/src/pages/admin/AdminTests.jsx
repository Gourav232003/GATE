import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Save, CheckCircle, AlertCircle, Clock, FileQuestion } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';

function AdminTests() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTest, setEditingTest] = useState(null);
  const [alert, setAlert] = useState(null);

  const emptyTest = {
    title: '',
    description: '',
    duration: 60,
    totalQuestions: 20,
    totalMarks: 30,
    difficulty: 'Medium',
    type: 'sectional',
    isActive: true
  };

  const [formData, setFormData] = useState(emptyTest);

  useEffect(() => {
    fetchTests();
  }, []);

  const getToken = () => localStorage.getItem('adminToken');

  const fetchTests = async () => {
    try {
      const response = await fetch('/api/admin/tests', {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      const data = await response.json();
      setTests(data.tests);
    } catch (error) {
      console.error('Error fetching tests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const url = editingTest 
        ? `/api/admin/tests/${editingTest.id}`
        : '/api/admin/tests';
      
      const method = editingTest ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to save');

      setAlert({ type: 'success', message: editingTest ? 'Test updated!' : 'Test created!' });
      setShowModal(false);
      setEditingTest(null);
      setFormData(emptyTest);
      fetchTests();
    } catch (error) {
      setAlert({ type: 'error', message: error.message });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this test?')) return;

    try {
      const response = await fetch(`/api/admin/tests/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });

      if (!response.ok) throw new Error('Failed to delete');

      setAlert({ type: 'success', message: 'Test deleted!' });
      fetchTests();
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to delete test' });
    }
  };

  const toggleActive = async (test) => {
    try {
      await fetch(`/api/admin/tests/${test.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ isActive: !test.isActive })
      });
      fetchTests();
    } catch (error) {
      console.error('Error toggling test:', error);
    }
  };

  const openEditModal = (test) => {
    setEditingTest(test);
    setFormData({
      title: test.title,
      description: test.description,
      duration: test.duration,
      totalQuestions: test.totalQuestions,
      totalMarks: test.totalMarks,
      difficulty: test.difficulty,
      type: test.type,
      isActive: test.isActive
    });
    setShowModal(true);
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
            <button onClick={() => setAlert(null)} className="ml-auto"><X className="w-4 h-4" /></button>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Test Management</h1>
            <p className="text-gray-600">{tests.length} tests available</p>
          </div>
          <button
            onClick={() => { setEditingTest(null); setFormData(emptyTest); setShowModal(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            <Plus className="w-5 h-5" />
            Create Test
          </button>
        </div>

        {/* Tests Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tests.map(test => (
              <div key={test.id} className={`bg-white rounded-xl shadow-sm border p-6 ${test.isActive ? 'border-gray-100' : 'border-red-200 bg-red-50'}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    test.type === 'full' ? 'bg-purple-100 text-purple-700' :
                    test.type === 'sectional' ? 'bg-blue-100 text-blue-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {test.type.charAt(0).toUpperCase() + test.type.slice(1)}
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openEditModal(test)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(test.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">{test.title}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{test.description}</p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    {test.duration} mins
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FileQuestion className="w-4 h-4" />
                    {test.totalQuestions} Qs
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    test.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                    test.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {test.difficulty}
                  </span>
                  <button
                    onClick={() => toggleActive(test)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      test.isActive 
                        ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {test.isActive ? 'Active' : 'Inactive'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {editingTest ? 'Edit Test' : 'Create New Test'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (mins)</label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Questions</label>
                  <input
                    type="number"
                    value={formData.totalQuestions}
                    onChange={(e) => setFormData({ ...formData, totalQuestions: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Marks</label>
                  <input
                    type="number"
                    value={formData.totalMarks}
                    onChange={(e) => setFormData({ ...formData, totalMarks: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="full">Full Length</option>
                  <option value="sectional">Sectional</option>
                  <option value="mini">Mini Test</option>
                </select>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {editingTest ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminTests;
