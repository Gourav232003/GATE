import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  BookmarkPlus,
  Bookmark,
  CheckCircle,
  XCircle,
  Lightbulb,
  Flag,
} from 'lucide-react';

// Sample questions data (will be fetched from API in production)
const sampleQuestions = [
  {
    id: 1,
    question: 'What is the time complexity of searching for an element in a balanced Binary Search Tree?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
    correctAnswer: 1,
    explanation: 'In a balanced BST, the height is O(log n). Since search operation traverses from root to leaf in the worst case, the time complexity is O(log n).',
    difficulty: 'Easy',
    topic: 'Trees',
    year: null,
  },
  {
    id: 2,
    question: 'Which of the following is NOT a property of a Binary Search Tree?',
    options: [
      'Left subtree contains only nodes with keys less than the node\'s key',
      'Right subtree contains only nodes with keys greater than the node\'s key',
      'Both left and right subtrees must also be binary search trees',
      'The tree must be complete',
    ],
    correctAnswer: 3,
    explanation: 'A BST does not need to be complete. A complete binary tree is one where all levels except possibly the last are completely filled. BST only needs to satisfy the ordering property.',
    difficulty: 'Medium',
    topic: 'Trees',
    year: null,
  },
  {
    id: 3,
    question: 'The worst-case time complexity of inserting n elements into an initially empty Binary Search Tree is:',
    options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
    correctAnswer: 2,
    explanation: 'If elements are inserted in sorted order (ascending or descending), the BST degenerates into a linked list. Each insertion takes O(n) time in the worst case, so n insertions take O(n²) time.',
    difficulty: 'Medium',
    topic: 'Trees',
    year: 'GATE 2019',
  },
  {
    id: 4,
    question: 'What is the minimum number of nodes in an AVL tree of height 3?',
    options: ['5', '7', '9', '12'],
    correctAnswer: 1,
    explanation: 'The minimum number of nodes in an AVL tree follows the recurrence N(h) = N(h-1) + N(h-2) + 1, with N(0)=1 and N(1)=2. For h=3: N(3) = N(2) + N(1) + 1 = 4 + 2 + 1 = 7.',
    difficulty: 'Hard',
    topic: 'Trees',
    year: 'GATE 2018',
  },
  {
    id: 5,
    question: 'In a complete binary tree with n nodes, what is the maximum height?',
    options: ['log₂(n)', '⌊log₂(n)⌋', '⌈log₂(n+1)⌉ - 1', 'n-1'],
    correctAnswer: 2,
    explanation: 'In a complete binary tree, the height is ⌈log₂(n+1)⌉ - 1 or equivalently ⌊log₂(n)⌋. This is because a complete binary tree of height h has between 2^h and 2^(h+1)-1 nodes.',
    difficulty: 'Medium',
    topic: 'Trees',
    year: null,
  },
];

function PracticeSession() {
  const { subject, topic } = useParams();
  const navigate = useNavigate();
  
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [bookmarked, setBookmarked] = useState(new Set());
  const [answers, setAnswers] = useState({});
  const [sessionStats, setSessionStats] = useState({ correct: 0, incorrect: 0, skipped: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuestions();
  }, [subject, topic]);

  const fetchQuestions = async () => {
    try {
      const response = await fetch(`/api/questions/${subject}/${topic}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setQuestions(data.questions || sampleQuestions);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setQuestions(sampleQuestions);
    } finally {
      setLoading(false);
    }
  };

  const currentQuestion = questions[currentIndex];

  const handleAnswerSelect = (index) => {
    if (answers[currentQuestion.id] !== undefined) return;
    setSelectedAnswer(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    setAnswers({ ...answers, [currentQuestion.id]: selectedAnswer });
    setSessionStats({
      ...sessionStats,
      correct: sessionStats.correct + (isCorrect ? 1 : 0),
      incorrect: sessionStats.incorrect + (isCorrect ? 0 : 1),
    });
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSelectedAnswer(answers[questions[currentIndex - 1]?.id] ?? null);
      setShowExplanation(answers[questions[currentIndex - 1]?.id] !== undefined);
    }
  };

  const toggleBookmark = () => {
    const newBookmarks = new Set(bookmarked);
    if (newBookmarks.has(currentQuestion.id)) {
      newBookmarks.delete(currentQuestion.id);
    } else {
      newBookmarks.add(currentQuestion.id);
    }
    setBookmarked(newBookmarks);
  };

  const getOptionClass = (index) => {
    const answered = answers[currentQuestion.id] !== undefined;
    const isSelected = selectedAnswer === index;
    const isCorrect = index === currentQuestion.correctAnswer;

    if (!answered) {
      return isSelected ? 'selected' : 'default';
    }

    if (isCorrect) return 'correct';
    if (isSelected && !isCorrect) return 'incorrect';
    return 'default';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No questions available for this topic.</p>
        <button
          onClick={() => navigate('/question-bank')}
          className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
        >
          Back to Question Bank
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/question-bank')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft size={20} />
          Back to Question Bank
        </button>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-green-600 font-medium">{sessionStats.correct} ✓</span>
            <span className="text-red-600 font-medium">{sessionStats.incorrect} ✗</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span className="text-sm text-gray-600">
            {Math.round(((currentIndex + 1) / questions.length) * 100)}% Complete
          </span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-500 transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Question Card */}
      <div className="question-card">
        {/* Question Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                currentQuestion.difficulty === 'Easy'
                  ? 'bg-green-100 text-green-700'
                  : currentQuestion.difficulty === 'Medium'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {currentQuestion.difficulty}
            </span>
            {currentQuestion.year && (
              <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                {currentQuestion.year}
              </span>
            )}
          </div>
          <button
            onClick={toggleBookmark}
            className={`p-2 rounded-lg transition-colors ${
              bookmarked.has(currentQuestion.id)
                ? 'text-yellow-500 bg-yellow-50'
                : 'text-gray-400 hover:bg-gray-100'
            }`}
          >
            {bookmarked.has(currentQuestion.id) ? <Bookmark size={20} /> : <BookmarkPlus size={20} />}
          </button>
        </div>

        {/* Question Text */}
        <h2 className="text-lg font-medium text-gray-800 mb-6">{currentQuestion.question}</h2>

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={answers[currentQuestion.id] !== undefined}
              className={`option-btn ${getOptionClass(index)}`}
            >
              <span
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  getOptionClass(index) === 'correct'
                    ? 'bg-green-500 text-white'
                    : getOptionClass(index) === 'incorrect'
                    ? 'bg-red-500 text-white'
                    : getOptionClass(index) === 'selected'
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {String.fromCharCode(65 + index)}
              </span>
              <span className="flex-1">{option}</span>
              {answers[currentQuestion.id] !== undefined && index === currentQuestion.correctAnswer && (
                <CheckCircle size={20} className="text-green-500" />
              )}
              {answers[currentQuestion.id] === index && index !== currentQuestion.correctAnswer && (
                <XCircle size={20} className="text-red-500" />
              )}
            </button>
          ))}
        </div>

        {/* Submit Button */}
        {answers[currentQuestion.id] === undefined && (
          <button
            onClick={handleSubmitAnswer}
            disabled={selectedAnswer === null}
            className="mt-6 w-full py-3 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Submit Answer
          </button>
        )}

        {/* Explanation */}
        {showExplanation && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
            <div className="flex items-start gap-3">
              <Lightbulb size={20} className="text-blue-500 mt-1" />
              <div>
                <h4 className="font-medium text-blue-800 mb-1">Explanation</h4>
                <p className="text-blue-700 text-sm">{currentQuestion.explanation}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft size={18} />
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={currentIndex === questions.length - 1}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
          <ArrowRight size={18} />
        </button>
      </div>

      {/* Question Navigator */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Question Navigator</h3>
        <div className="flex flex-wrap gap-2">
          {questions.map((q, index) => (
            <button
              key={q.id}
              onClick={() => {
                setCurrentIndex(index);
                setSelectedAnswer(answers[q.id] ?? null);
                setShowExplanation(answers[q.id] !== undefined);
              }}
              className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                index === currentIndex
                  ? 'bg-primary-500 text-white'
                  : answers[q.id] !== undefined
                  ? answers[q.id] === q.correctAnswer
                    ? 'bg-green-100 text-green-700 border border-green-200'
                    : 'bg-red-100 text-red-700 border border-red-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PracticeSession;
