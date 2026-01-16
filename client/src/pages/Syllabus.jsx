import React, { useState } from 'react';
import { CheckCircle, Circle, ChevronDown, ChevronRight, BookOpen, Target, Calendar } from 'lucide-react';

const syllabus = [
  {
    id: 'general',
    name: 'General Aptitude',
    weightage: 15,
    icon: '🧠',
    topics: [
      {
        id: 'verbal',
        name: 'Verbal Aptitude',
        subtopics: [
          'English Grammar',
          'Sentence Completion',
          'Verbal Analogies',
          'Word Groups',
          'Critical Reasoning',
          'Verbal Deduction',
        ],
      },
      {
        id: 'quantitative',
        name: 'Quantitative Aptitude',
        subtopics: [
          'Data Interpretation',
          'Data Sufficiency',
          'Numerical Estimation',
          'Probability & Statistics',
          'Mensuration',
          'Elementary Mathematics',
        ],
      },
    ],
  },
  {
    id: 'mathematics',
    name: 'Engineering Mathematics',
    weightage: 13,
    icon: '📐',
    topics: [
      {
        id: 'discrete-math',
        name: 'Discrete Mathematics',
        subtopics: [
          'Propositional and First Order Logic',
          'Sets, Relations, Functions',
          'Partial Orders and Lattices',
          'Monoids, Groups',
          'Graphs: Connectivity, Matching, Coloring',
          'Combinatorics: Counting, Recurrence Relations',
        ],
      },
      {
        id: 'linear-algebra',
        name: 'Linear Algebra',
        subtopics: [
          'Matrices, Determinants',
          'Systems of Linear Equations',
          'Eigenvalues and Eigenvectors',
          'LU Decomposition',
        ],
      },
      {
        id: 'calculus',
        name: 'Calculus',
        subtopics: [
          'Limits, Continuity and Differentiability',
          'Maxima and Minima',
          'Mean Value Theorem',
          'Integration',
        ],
      },
      {
        id: 'probability',
        name: 'Probability & Statistics',
        subtopics: [
          'Random Variables',
          'Uniform, Normal, Exponential, Poisson Distributions',
          'Mean, Median, Mode, Standard Deviation',
          'Conditional Probability',
          "Bayes' Theorem",
        ],
      },
    ],
  },
  {
    id: 'core',
    name: 'Core Computer Science',
    weightage: 72,
    icon: '💻',
    topics: [
      {
        id: 'digital-logic',
        name: 'Digital Logic',
        subtopics: [
          'Boolean Algebra',
          'Combinational Circuits',
          'Sequential Circuits',
          'Minimization',
          'Number Representations',
        ],
      },
      {
        id: 'coa',
        name: 'Computer Organization & Architecture',
        subtopics: [
          'Machine Instructions and Addressing Modes',
          'ALU, Data Path and Control Unit',
          'Memory Hierarchy: Cache, Main Memory',
          'I/O Interface',
          'Pipelining',
        ],
      },
      {
        id: 'pl',
        name: 'Programming & Data Structures',
        subtopics: [
          'Programming in C',
          'Recursion',
          'Arrays, Stacks, Queues',
          'Linked Lists',
          'Trees, Binary Search Trees',
          'Binary Heaps',
          'Graphs',
        ],
      },
      {
        id: 'algorithms',
        name: 'Algorithms',
        subtopics: [
          'Searching, Sorting',
          'Hashing',
          'Asymptotic Analysis',
          'Algorithm Design Techniques',
          'Graph Algorithms',
          'Minimum Spanning Trees',
          'Shortest Paths',
        ],
      },
      {
        id: 'toc',
        name: 'Theory of Computation',
        subtopics: [
          'Regular Expressions and Finite Automata',
          'Context-Free Grammars and Push-down Automata',
          'Regular and Context-Free Languages',
          'Turing Machines',
          'Undecidability',
        ],
      },
      {
        id: 'compiler',
        name: 'Compiler Design',
        subtopics: [
          'Lexical Analysis',
          'Parsing',
          'Syntax-Directed Translation',
          'Runtime Environments',
          'Intermediate Code Generation',
          'Local Optimization',
        ],
      },
      {
        id: 'os',
        name: 'Operating Systems',
        subtopics: [
          'System Calls, Processes, Threads',
          'Inter-Process Communication',
          'CPU and I/O Scheduling',
          'Synchronization',
          'Deadlock',
          'Memory Management',
          'Virtual Memory',
          'File Systems',
        ],
      },
      {
        id: 'dbms',
        name: 'Databases',
        subtopics: [
          'ER-Model',
          'Relational Model',
          'SQL',
          'Integrity Constraints',
          'Normalization',
          'File Organization',
          'Indexing',
          'Transactions and Concurrency Control',
        ],
      },
      {
        id: 'cn',
        name: 'Computer Networks',
        subtopics: [
          'Network Models',
          'Data Link Layer Protocols',
          'Network Layer: IP, Routing',
          'Transport Layer: TCP, UDP',
          'Application Layer Protocols',
          'Network Security',
        ],
      },
    ],
  },
];

function Syllabus() {
  const [expandedSection, setExpandedSection] = useState('core');
  const [expandedTopics, setExpandedTopics] = useState(new Set(['pl']));
  const [completedTopics, setCompletedTopics] = useState(new Set());

  const toggleTopic = (topicId) => {
    const newExpanded = new Set(expandedTopics);
    if (newExpanded.has(topicId)) {
      newExpanded.delete(topicId);
    } else {
      newExpanded.add(topicId);
    }
    setExpandedTopics(newExpanded);
  };

  const toggleCompleted = (subtopic, e) => {
    e.stopPropagation();
    const newCompleted = new Set(completedTopics);
    if (newCompleted.has(subtopic)) {
      newCompleted.delete(subtopic);
    } else {
      newCompleted.add(subtopic);
    }
    setCompletedTopics(newCompleted);
  };

  const calculateProgress = (section) => {
    const allSubtopics = section.topics.flatMap((t) => t.subtopics);
    const completed = allSubtopics.filter((s) => completedTopics.has(s)).length;
    return Math.round((completed / allSubtopics.length) * 100);
  };

  const totalSubtopics = syllabus.reduce(
    (acc, section) => acc + section.topics.reduce((a, t) => a + t.subtopics.length, 0),
    0
  );

  const totalCompleted = completedTopics.size;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">GATE CS Syllabus 2026</h1>
          <p className="text-gray-500">Track your preparation progress across all topics</p>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
              <Target size={20} className="text-primary-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {Math.round((totalCompleted / totalSubtopics) * 100)}%
          </p>
          <p className="text-sm text-gray-500">Overall Progress</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <CheckCircle size={20} className="text-green-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">{totalCompleted}</p>
          <p className="text-sm text-gray-500">Topics Completed</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
              <BookOpen size={20} className="text-orange-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">{totalSubtopics - totalCompleted}</p>
          <p className="text-sm text-gray-500">Topics Remaining</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <Calendar size={20} className="text-purple-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">Feb 2026</p>
          <p className="text-sm text-gray-500">GATE Exam</p>
        </div>
      </div>

      {/* Syllabus Sections */}
      <div className="space-y-4">
        {syllabus.map((section) => (
          <div key={section.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Section Header */}
            <button
              onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl">{section.icon}</span>
                <div className="text-left">
                  <h2 className="text-lg font-semibold text-gray-800">{section.name}</h2>
                  <p className="text-sm text-gray-500">
                    Weightage: ~{section.weightage} marks • {section.topics.length} topics
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden md:block">
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-500 rounded-full"
                        style={{ width: `${calculateProgress(section)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-600">
                      {calculateProgress(section)}%
                    </span>
                  </div>
                </div>
                {expandedSection === section.id ? (
                  <ChevronDown size={20} className="text-gray-400" />
                ) : (
                  <ChevronRight size={20} className="text-gray-400" />
                )}
              </div>
            </button>

            {/* Topics List */}
            {expandedSection === section.id && (
              <div className="border-t border-gray-100 px-6 py-4 bg-gray-50">
                <div className="space-y-3">
                  {section.topics.map((topic) => (
                    <div key={topic.id} className="bg-white rounded-lg border border-gray-100">
                      <button
                        onClick={() => toggleTopic(topic.id)}
                        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {expandedTopics.has(topic.id) ? (
                            <ChevronDown size={16} className="text-gray-400" />
                          ) : (
                            <ChevronRight size={16} className="text-gray-400" />
                          )}
                          <span className="font-medium text-gray-800">{topic.name}</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {topic.subtopics.filter((s) => completedTopics.has(s)).length}/
                          {topic.subtopics.length} completed
                        </span>
                      </button>

                      {expandedTopics.has(topic.id) && (
                        <div className="px-4 pb-4 pt-2 border-t border-gray-100">
                          <div className="grid md:grid-cols-2 gap-2">
                            {topic.subtopics.map((subtopic) => (
                              <button
                                key={subtopic}
                                onClick={(e) => toggleCompleted(subtopic, e)}
                                className={`flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                                  completedTopics.has(subtopic)
                                    ? 'bg-green-50 text-green-700'
                                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                }`}
                              >
                                {completedTopics.has(subtopic) ? (
                                  <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
                                ) : (
                                  <Circle size={18} className="text-gray-300 flex-shrink-0" />
                                )}
                                <span className="text-sm">{subtopic}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Exam Info */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-700 rounded-xl p-6 text-white">
        <h3 className="text-xl font-bold mb-2">GATE 2026 Exam Pattern</h3>
        <div className="grid md:grid-cols-4 gap-4 mt-4">
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-2xl font-bold">65</p>
            <p className="text-sm text-primary-100">Total Questions</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-2xl font-bold">100</p>
            <p className="text-sm text-primary-100">Total Marks</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-2xl font-bold">3 hrs</p>
            <p className="text-sm text-primary-100">Duration</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-2xl font-bold">MCQ + NAT</p>
            <p className="text-sm text-primary-100">Question Types</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Syllabus;
