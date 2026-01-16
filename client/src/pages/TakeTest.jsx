import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Clock,
  Flag,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  XCircle,
  Bookmark,
  BookmarkPlus,
  Send,
} from 'lucide-react';

// Sample test questions
const testQuestions = [
  {
    id: 1,
    question: 'Consider a binary tree with n nodes. What is the maximum number of edges in the tree?',
    options: ['n', 'n-1', 'n+1', 'n/2'],
    correctAnswer: 1,
    marks: 1,
    negativeMarks: 0.33,
  },
  {
    id: 2,
    question: 'The time complexity of building a heap from an array of n elements is:',
    options: ['O(n log n)', 'O(n)', 'O(log n)', 'O(n²)'],
    correctAnswer: 1,
    marks: 1,
    negativeMarks: 0.33,
  },
  {
    id: 3,
    question: 'Which of the following sorting algorithms has the best average case time complexity?',
    options: ['Bubble Sort', 'Quick Sort', 'Insertion Sort', 'Selection Sort'],
    correctAnswer: 1,
    marks: 1,
    negativeMarks: 0.33,
  },
  {
    id: 4,
    question: 'In a graph with V vertices and E edges, what is the time complexity of DFS traversal using adjacency list?',
    options: ['O(V)', 'O(E)', 'O(V + E)', 'O(V × E)'],
    correctAnswer: 2,
    marks: 2,
    negativeMarks: 0.66,
  },
  {
    id: 5,
    question: 'The minimum number of comparisons required to find the minimum and maximum of 100 elements is:',
    options: ['148', '147', '100', '99'],
    correctAnswer: 0,
    marks: 2,
    negativeMarks: 0.66,
  },
  {
    id: 6,
    question: 'Consider the following SQL query:\nSELECT * FROM Employee WHERE salary > (SELECT AVG(salary) FROM Employee);\n\nWhat type of subquery is this?',
    options: ['Correlated subquery', 'Non-correlated subquery', 'Nested subquery', 'Inline view'],
    correctAnswer: 1,
    marks: 1,
    negativeMarks: 0.33,
  },
  {
    id: 7,
    question: 'Which normal form deals with multivalued dependencies?',
    options: ['2NF', '3NF', 'BCNF', '4NF'],
    correctAnswer: 3,
    marks: 1,
    negativeMarks: 0.33,
  },
  {
    id: 8,
    question: 'In the context of operating systems, thrashing occurs when:',
    options: [
      'CPU utilization is very high',
      'The system spends more time paging than executing',
      'Multiple processes are in deadlock',
      'Memory fragmentation is high',
    ],
    correctAnswer: 1,
    marks: 2,
    negativeMarks: 0.66,
  },
  {
    id: 9,
    question: 'The Banker\'s algorithm is used for:',
    options: ['Deadlock detection', 'Deadlock avoidance', 'Deadlock prevention', 'Deadlock recovery'],
    correctAnswer: 1,
    marks: 1,
    negativeMarks: 0.33,
  },
  {
    id: 10,
    question: 'In TCP/IP, the protocol responsible for routing packets is:',
    options: ['TCP', 'UDP', 'IP', 'ICMP'],
    correctAnswer: 2,
    marks: 1,
    negativeMarks: 0.33,
  },
];

function TakeTest() {
  const { testId } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState(testQuestions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState(new Set());
  const [timeLeft, setTimeLeft] = useState(180 * 60); // 180 minutes in seconds
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [results, setResults] = useState(null);

  // Timer
  useEffect(() => {
    if (testSubmitted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [testSubmitted]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerClass = () => {
    if (timeLeft <= 300) return 'timer-danger'; // Last 5 mins
    if (timeLeft <= 900) return 'timer-warning'; // Last 15 mins
    return '';
  };

  const handleAnswerSelect = (optionIndex) => {
    if (testSubmitted) return;
    setAnswers({ ...answers, [questions[currentIndex].id]: optionIndex });
  };

  const toggleMarkForReview = () => {
    const newMarked = new Set(markedForReview);
    if (newMarked.has(currentIndex)) {
      newMarked.delete(currentIndex);
    } else {
      newMarked.add(currentIndex);
    }
    setMarkedForReview(newMarked);
  };

  const handleSubmit = () => {
    // Calculate results
    let correct = 0;
    let incorrect = 0;
    let unattempted = 0;
    let totalScore = 0;
    let maxScore = 0;

    questions.forEach((q) => {
      maxScore += q.marks;
      if (answers[q.id] !== undefined) {
        if (answers[q.id] === q.correctAnswer) {
          correct++;
          totalScore += q.marks;
        } else {
          incorrect++;
          totalScore -= q.negativeMarks;
        }
      } else {
        unattempted++;
      }
    });

    setResults({
      correct,
      incorrect,
      unattempted,
      totalScore: Math.max(0, totalScore).toFixed(2),
      maxScore,
      percentage: ((Math.max(0, totalScore) / maxScore) * 100).toFixed(1),
      timeTaken: 180 * 60 - timeLeft,
    });
    setTestSubmitted(true);
    setShowSubmitModal(false);
  };

  const currentQuestion = questions[currentIndex];

  const getQuestionStatus = (index) => {
    const qId = questions[index].id;
    const isMarked = markedForReview.has(index);
    const isAnswered = answers[qId] !== undefined;

    if (testSubmitted) {
      if (answers[qId] === undefined) return 'unattempted';
      return answers[qId] === questions[index].correctAnswer ? 'correct' : 'incorrect';
    }

    if (isMarked && isAnswered) return 'marked-answered';
    if (isMarked) return 'marked';
    if (isAnswered) return 'answered';
    return 'unattempted';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'answered':
        return 'bg-green-500 text-white';
      case 'marked':
        return 'bg-purple-500 text-white';
      case 'marked-answered':
        return 'bg-purple-500 text-white border-2 border-green-400';
      case 'correct':
        return 'bg-green-500 text-white';
      case 'incorrect':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  if (testSubmitted && results) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
        {/* Results Header */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-700 rounded-2xl p-8 text-white text-center">
          <h1 className="text-3xl font-bold mb-2">Test Completed!</h1>
          <p className="text-primary-100">Here's your performance summary</p>
        </div>

        {/* Score Card */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="text-center mb-8">
            <div className="w-32 h-32 mx-auto mb-4 relative">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="12"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke={parseFloat(results.percentage) >= 50 ? '#10b981' : '#f59e0b'}
                  strokeWidth="12"
                  strokeDasharray={`${(parseFloat(results.percentage) / 100) * 352} 352`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-gray-800">{results.percentage}%</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              {results.totalScore} / {results.maxScore} marks
            </h2>
            <p className="text-gray-500">
              Time taken: {formatTime(results.timeTaken)}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <CheckCircle size={24} className="text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">{results.correct}</p>
              <p className="text-sm text-gray-500">Correct</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-xl">
              <XCircle size={24} className="text-red-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-red-600">{results.incorrect}</p>
              <p className="text-sm text-gray-500">Incorrect</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <AlertCircle size={24} className="text-gray-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-600">{results.unattempted}</p>
              <p className="text-sm text-gray-500">Unattempted</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/mock-tests')}
              className="flex-1 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 font-medium"
            >
              Back to Tests
            </button>
            <button
              onClick={() => {
                setCurrentIndex(0);
              }}
              className="flex-1 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 font-medium"
            >
              Review Answers
            </button>
          </div>
        </div>

        {/* Question Review */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Question Navigator</h3>
          <div className="flex flex-wrap gap-2">
            {questions.map((q, index) => (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(index)}
                className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${getStatusColor(getQuestionStatus(index))}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-4 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span>Correct</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span>Incorrect</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-100 rounded"></div>
              <span>Unattempted</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto animate-fadeIn">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-4 flex items-center justify-between sticky top-0 z-30">
        <h1 className="text-lg font-semibold text-gray-800">Mock Test #{testId}</h1>
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 text-lg font-mono font-semibold ${getTimerClass()}`}>
            <Clock size={20} />
            {formatTime(timeLeft)}
          </div>
          <button
            onClick={() => setShowSubmitModal(true)}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium flex items-center gap-2"
          >
            <Send size={18} />
            Submit
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-4">
        {/* Question Panel */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm p-6">
            {/* Question Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-500">
                  Question {currentIndex + 1} of {questions.length}
                </span>
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                  {currentQuestion.marks} marks
                </span>
                {currentQuestion.negativeMarks > 0 && (
                  <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full">
                    -{currentQuestion.negativeMarks} for wrong
                  </span>
                )}
              </div>
              <button
                onClick={toggleMarkForReview}
                className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-colors ${
                  markedForReview.has(currentIndex)
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Flag size={16} />
                {markedForReview.has(currentIndex) ? 'Marked' : 'Mark for Review'}
              </button>
            </div>

            {/* Question Text */}
            <h2 className="text-lg text-gray-800 mb-6 whitespace-pre-wrap">{currentQuestion.question}</h2>

            {/* Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => {
                const isSelected = answers[currentQuestion.id] === index;
                const showCorrect = testSubmitted && index === currentQuestion.correctAnswer;
                const showIncorrect = testSubmitted && isSelected && index !== currentQuestion.correctAnswer;

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={testSubmitted}
                    className={`option-btn ${
                      showCorrect
                        ? 'correct'
                        : showIncorrect
                        ? 'incorrect'
                        : isSelected
                        ? 'selected'
                        : 'default'
                    }`}
                  >
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        showCorrect
                          ? 'bg-green-500 text-white'
                          : showIncorrect
                          ? 'bg-red-500 text-white'
                          : isSelected
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="flex-1">{option}</span>
                  </button>
                );
              })}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
              <button
                onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                disabled={currentIndex === 0}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronLeft size={18} />
                Previous
              </button>
              <button
                onClick={() => {
                  if (answers[currentQuestion.id] !== undefined) {
                    const newAnswers = { ...answers };
                    delete newAnswers[currentQuestion.id];
                    setAnswers(newAnswers);
                  }
                }}
                disabled={answers[currentQuestion.id] === undefined || testSubmitted}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50"
              >
                Clear Response
              </button>
              <button
                onClick={() => setCurrentIndex(Math.min(questions.length - 1, currentIndex + 1))}
                disabled={currentIndex === questions.length - 1}
                className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50"
              >
                Next
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Question Navigator */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-4 sticky top-24">
            <h3 className="font-semibold text-gray-800 mb-4">Questions</h3>
            <div className="grid grid-cols-5 gap-2">
              {questions.map((q, index) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-full aspect-square rounded-lg text-sm font-medium transition-colors ${
                    index === currentIndex
                      ? 'ring-2 ring-primary-500 ring-offset-2'
                      : ''
                  } ${getStatusColor(getQuestionStatus(index))}`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            {/* Legend */}
            <div className="mt-4 space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span>Answered ({Object.keys(answers).length})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-purple-500 rounded"></div>
                <span>Marked ({markedForReview.size})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-100 border border-gray-200 rounded"></div>
                <span>Not Visited ({questions.length - Object.keys(answers).length})</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 animate-fadeIn">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Submit Test?</h2>
            <p className="text-gray-600 mb-4">Are you sure you want to submit the test?</p>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Answered</span>
                <span className="font-medium text-green-600">{Object.keys(answers).length}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Marked for Review</span>
                <span className="font-medium text-purple-600">{markedForReview.size}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Unanswered</span>
                <span className="font-medium text-gray-600">
                  {questions.length - Object.keys(answers).length}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TakeTest;
