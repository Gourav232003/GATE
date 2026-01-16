import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Edit2, Trash2, ChevronLeft, ChevronRight,
  X, Save, AlertCircle, CheckCircle, Calendar, FileText, Upload, Download
} from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';

function AdminPYQs() {
  const [pyqs, setPyqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [years, setYears] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [filters, setFilters] = useState({ year: '', subject: '', search: '' });
  const [showModal, setShowModal] = useState(false);
  const [editingPyq, setEditingPyq] = useState(null);
  const [alert, setAlert] = useState(null);
  const [stats, setStats] = useState({ totalPapers: 0, totalQuestions: 0, yearsCovered: 0 });

  const emptyPyq = {
    year: new Date().getFullYear().toString(),
    subject: '',
    title: '',
    description: '',
    questionCount: 0,
    duration: 180,
    totalMarks: 100
  };

  const [formData, setFormData] = useState(emptyPyq);

  useEffect(() => {
    fetchPYQs();
    fetchOptions();
  }, []);

  useEffect(() => {
    fetchPYQs();
  }, [filters]);

  const getToken = () => localStorage.getItem('adminToken');

  const fetchOptions = async () => {
    try {
      const response = await fetch('/api/admin/options', {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      const data = await response.json();
      setSubjects(data.subjects || []);
      setYears(data.years || []);
    } catch (error) {
      console.error('Error fetching options:', error);
    }
  };

  const fetchPYQs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/pyqs', {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      const data = await response.json();
      setPyqs(data.papers || []);
      setStats({
        totalPapers: data.totalPapers || 0,
        totalQuestions: data.totalQuestions || 0,
        yearsCovered: data.yearsCovered || 0
      });
    } catch (error) {
      console.error('Error fetching PYQs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const url = editingPyq 
        ? `/api/admin/pyqs/${editingPyq.id}`
        : '/api/admin/pyqs';
      
      const method = editingPyq ? 'PUT' : 'POST';

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

      setAlert({ type: 'success', message: editingPyq ? 'PYQ updated!' : 'PYQ created!' });
      setShowModal(false);
      setEditingPyq(null);
      setFormData(emptyPyq);
      fetchPYQs();
    } catch (error) {
      setAlert({ type: 'error', message: error.message });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this PYQ paper?')) return;

    try {
      const response = await fetch(`/api/admin/pyqs/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });

      if (!response.ok) throw new Error('Failed to delete');

      setAlert({ type: 'success', message: 'PYQ paper deleted!' });
      fetchPYQs();
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to delete PYQ paper' });
    }
  };

  const openEditModal = (pyq) => {
    setEditingPyq(pyq);
    setFormData({
      year: pyq.year,
      subject: pyq.subject || '',
      title: pyq.title,
      description: pyq.description || '',
      questionCount: pyq.questionCount || 0,
      duration: pyq.duration || 180,
      totalMarks: pyq.totalMarks || 100
    });
    setShowModal(true);
  };

  const openNewModal = () => {
    setEditingPyq(null);
    setFormData(emptyPyq);
    setShowModal(true);
  };

  // Generate year options (from 2010 to current year)
  const yearOptions = Array.from(
    { length: new Date().getFullYear() - 2009 },
    (_, i) => (2010 + i).toString()
  ).reverse();

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
            <h1 className="text-2xl font-bold text-gray-900">Previous Year Papers</h1>
            <p className="text-gray-600">Manage GATE PYQ papers and questions</p>
          </div>
          <button
            onClick={openNewModal}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            <Plus className="w-5 h-5" />
            Add PYQ Paper
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Papers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalPapers}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Years Covered</p>
                <p className="text-2xl font-bold text-gray-900">{stats.yearsCovered}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Questions</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalQuestions}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search papers..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <select
              value={filters.year}
              onChange={(e) => setFilters({ ...filters, year: e.target.value })}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Years</option>
              {yearOptions.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <select
              value={filters.subject}
              onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Subjects</option>
              {subjects.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* PYQ Papers Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          ) : pyqs.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No PYQ papers found</p>
              <p className="text-sm">Questions with year field will appear here</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Year</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Questions</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Topics</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {pyqs.map(pyq => (
                    <tr key={`${pyq.year}-${pyq.subject}`} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                          {pyq.year}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {subjects.find(s => s.value === pyq.subject)?.label || pyq.subject || 'All Subjects'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{pyq.questionCount} questions</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{pyq.topicCount || 0} topics</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => openEditModal(pyq)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg mr-1"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(`${pyq.year}-${pyq.subject}`)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
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
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingPyq ? 'Edit PYQ Paper' : 'Add PYQ Paper'}
                </h2>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4 overflow-y-auto flex-1">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Year *</label>
                    <select
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    >
                      {yearOptions.map(y => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">All Subjects (Full Paper)</option>
                      {subjects.map(s => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder={`GATE ${formData.year} Question Paper`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    rows={3}
                    placeholder="Brief description of this paper..."
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration (min)</label>
                    <input
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      min={0}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Marks</label>
                    <input
                      type="number"
                      value={formData.totalMarks}
                      onChange={(e) => setFormData({ ...formData, totalMarks: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      min={0}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Questions</label>
                    <input
                      type="number"
                      value={formData.questionCount}
                      onChange={(e) => setFormData({ ...formData, questionCount: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      min={0}
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
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
                  {editingPyq ? 'Update' : 'Create'} Paper
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminPYQs;
