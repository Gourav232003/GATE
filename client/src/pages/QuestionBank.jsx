import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ChevronRight, Search, Filter, Tag, BarChart2, Loader2 } from 'lucide-react';

const defaultSubjects = [
  {
    id: 'engineering-mathematics',
    name: 'Engineering Mathematics',
    icon: '📐',
    topics: [
      { id: 'linear-algebra', name: 'Linear Algebra', difficulty: 'Medium' },
      { id: 'calculus', name: 'Calculus', difficulty: 'Hard' },
      { id: 'probability', name: 'Probability & Statistics', difficulty: 'Medium' },
      { id: 'differential-equations', name: 'Differential Equations', difficulty: 'Hard' },
      { id: 'discrete-mathematics', name: 'Discrete Mathematics', difficulty: 'Medium' },
    ],
  },
  {
    id: 'data-structures',
    name: 'Data Structures',
    icon: '🔢',
    topics: [
      { id: 'arrays-linked-lists', name: 'Arrays & Linked Lists', difficulty: 'Easy' },
      { id: 'stacks-queues', name: 'Stacks & Queues', difficulty: 'Easy' },
      { id: 'trees', name: 'Trees & Binary Trees', difficulty: 'Medium' },
      { id: 'graphs', name: 'Graphs', difficulty: 'Hard' },
      { id: 'sorting-searching', name: 'Sorting & Searching', difficulty: 'Medium' },
      { id: 'hashing', name: 'Hashing', difficulty: 'Medium' },
      { id: 'heaps', name: 'Heaps', difficulty: 'Medium' },
    ],
  },
  {
    id: 'algorithms',
    name: 'Algorithms',
    icon: '⚡',
    topics: [
      { id: 'complexity-analysis', name: 'Complexity Analysis', difficulty: 'Medium' },
      { id: 'divide-conquer', name: 'Divide and Conquer', difficulty: 'Medium' },
      { id: 'dynamic-programming', name: 'Dynamic Programming', difficulty: 'Hard' },
      { id: 'greedy-algorithms', name: 'Greedy Algorithms', difficulty: 'Medium' },
    ],
  },
  {
    id: 'dbms',
    name: 'Database Management Systems',
    icon: '🗄️',
    topics: [
      { id: 'er-model', name: 'ER Model', difficulty: 'Easy' },
      { id: 'relational-model', name: 'Relational Model', difficulty: 'Easy' },
      { id: 'sql', name: 'SQL', difficulty: 'Medium' },
      { id: 'normalization', name: 'Normalization', difficulty: 'Medium' },
      { id: 'transactions', name: 'Transactions & Concurrency', difficulty: 'Hard' },
      { id: 'indexing', name: 'Indexing', difficulty: 'Medium' },
    ],
  },
  {
    id: 'operating-systems',
    name: 'Operating Systems',
    icon: '💻',
    topics: [
      { id: 'process-management', name: 'Process Management', difficulty: 'Medium' },
      { id: 'cpu-scheduling', name: 'CPU Scheduling', difficulty: 'Medium' },
      { id: 'synchronization', name: 'Process Synchronization', difficulty: 'Hard' },
      { id: 'memory-management', name: 'Memory Management', difficulty: 'Hard' },
      { id: 'deadlocks', name: 'Deadlocks', difficulty: 'Medium' },
      { id: 'file-systems', name: 'File Systems', difficulty: 'Easy' },
    ],
  },
  {
    id: 'computer-networks',
    name: 'Computer Networks',
    icon: '🌐',
    topics: [
      { id: 'osi-tcp', name: 'OSI & TCP/IP Model', difficulty: 'Easy' },
      { id: 'data-link-layer', name: 'Data Link Layer', difficulty: 'Medium' },
      { id: 'network-layer', name: 'Network Layer', difficulty: 'Medium' },
      { id: 'transport-layer', name: 'Transport Layer', difficulty: 'Medium' },
      { id: 'application-layer', name: 'Application Layer', difficulty: 'Easy' },
    ],
  },
  {
    id: 'toc',
    name: 'Theory of Computation',
    icon: '🔄',
    topics: [
      { id: 'finite-automata', name: 'Finite Automata', difficulty: 'Medium' },
      { id: 'regular-languages', name: 'Regular Languages', difficulty: 'Medium' },
      { id: 'cfg-pda', name: 'CFG & PDA', difficulty: 'Hard' },
      { id: 'turing-machines', name: 'Turing Machines', difficulty: 'Hard' },
      { id: 'decidability', name: 'Decidability', difficulty: 'Hard' },
    ],
  },
  {
    id: 'compiler-design',
    name: 'Compiler Design',
    icon: '⚙️',
    topics: [
      { id: 'lexical-analysis', name: 'Lexical Analysis', difficulty: 'Easy' },
      { id: 'parsing', name: 'Syntax Analysis (Parsing)', difficulty: 'Medium' },
      { id: 'syntax-directed', name: 'Syntax Directed Translation', difficulty: 'Medium' },
      { id: 'code-optimization', name: 'Code Optimization', difficulty: 'Hard' },
    ],
  },
  {
    id: 'digital-logic',
    name: 'Digital Logic',
    icon: '🔌',
    topics: [
      { id: 'boolean-algebra', name: 'Boolean Algebra', difficulty: 'Easy' },
      { id: 'combinational-circuits', name: 'Combinational Circuits', difficulty: 'Medium' },
      { id: 'sequential-circuits', name: 'Sequential Circuits', difficulty: 'Medium' },
    ],
  },
  {
    id: 'computer-organization',
    name: 'Computer Organization & Architecture',
    icon: '🖥️',
    topics: [
      { id: 'cpu-architecture', name: 'CPU Architecture', difficulty: 'Medium' },
      { id: 'memory-hierarchy', name: 'Memory Hierarchy', difficulty: 'Medium' },
      { id: 'io-systems', name: 'I/O Systems', difficulty: 'Medium' },
      { id: 'pipelining', name: 'Pipelining', difficulty: 'Hard' },
    ],
  },
];

function QuestionBank() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [expandedSubject, setExpandedSubject] = useState(null);
  const [subjects, setSubjects] = useState(defaultSubjects);
  const [questionCounts, setQuestionCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuestionCounts();
  }, []);

  const fetchQuestionCounts = async () => {
    try {
      const response = await fetch('/api/questions', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      
      // Count questions by subject and topic
      const counts = {};
      data.questions.forEach(q => {
        if (!counts[q.subject]) {
          counts[q.subject] = { total: 0, topics: {} };
        }
        counts[q.subject].total++;
        if (!counts[q.subject].topics[q.topic]) {
          counts[q.subject].topics[q.topic] = 0;
        }
        counts[q.subject].topics[q.topic]++;
      });
      
      setQuestionCounts(counts);
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTopicQuestionCount = (subjectId, topicId) => {
    return questionCounts[subjectId]?.topics[topicId] || 0;
  };

  const getSubjectQuestionCount = (subjectId) => {
    return questionCounts[subjectId]?.total || 0;
  };

  const filteredSubjects = subjects.map((subject) => ({
    ...subject,
    topics: subject.topics.filter((topic) => {
      const matchesSearch =
        topic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subject.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDifficulty =
        selectedDifficulty === 'all' || topic.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();
      return matchesSearch && matchesDifficulty;
    }),
  })).filter((subject) => subject.topics.length > 0);

  const totalQuestions = Object.values(questionCounts).reduce((acc, s) => acc + s.total, 0);

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
          <h1 className="text-2xl font-bold text-gray-800">Question Bank</h1>
          <p className="text-gray-500">
            {totalQuestions > 0 
              ? `${totalQuestions} practice questions across all subjects`
              : 'Browse topics and start practicing'}
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 w-64"
            />
          </div>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>

      {/* Subject Cards */}
      <div className="grid gap-4">
        {filteredSubjects.map((subject) => (
          <div key={subject.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Subject Header */}
            <button
              onClick={() => setExpandedSubject(expandedSubject === subject.id ? null : subject.id)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl">{subject.icon}</span>
                <div className="text-left">
                  <h2 className="text-lg font-semibold text-gray-800">{subject.name}</h2>
                  <p className="text-sm text-gray-500">
                    {subject.topics.length} topics •{' '}
                    {getSubjectQuestionCount(subject.id)} questions
                  </p>
                </div>
              </div>
              <ChevronRight
                size={20}
                className={`text-gray-400 transition-transform ${
                  expandedSubject === subject.id ? 'rotate-90' : ''
                }`}
              />
            </button>

            {/* Topics List */}
            {expandedSubject === subject.id && (
              <div className="border-t border-gray-100 px-6 py-4 bg-gray-50">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {subject.topics.map((topic) => {
                    const topicCount = getTopicQuestionCount(subject.id, topic.id);
                    return (
                      <Link
                        key={topic.id}
                        to={`/practice/${subject.id}/${topic.id}`}
                        className="bg-white p-4 rounded-lg border border-gray-100 hover:border-primary-300 hover:shadow-md transition-all group"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium text-gray-800 group-hover:text-primary-600">
                              {topic.name}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              {topicCount > 0 ? `${topicCount} questions` : 'Coming soon'}
                            </p>
                          </div>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              topic.difficulty === 'Easy'
                                ? 'bg-green-100 text-green-700'
                                : topic.difficulty === 'Medium'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {topic.difficulty}
                          </span>
                        </div>
                        <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                          <BarChart2 size={12} />
                          <span>{topicCount > 0 ? 'Click to practice' : 'No questions yet'}</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredSubjects.length === 0 && (
        <div className="text-center py-12">
          <BookOpen size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600">No topics found</h3>
          <p className="text-gray-500">Try adjusting your search or filter</p>
        </div>
      )}
    </div>
  );
}

export default QuestionBank;
