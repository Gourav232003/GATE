import React, { useState, useCallback } from 'react';
import { 
  Upload, FileText, Image, X, Loader2, CheckCircle, AlertCircle,
  ChevronDown, ChevronUp, Edit2, Trash2, Save, Wand2, FileUp,
  ScanLine, BookOpen, Tag, Hash, Award
} from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import Tesseract from 'tesseract.js';

// Set PDF.js worker using local file
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

// GATE Subject and Topic Taxonomy
const GATE_TAXONOMY = {
  'engineering-mathematics': {
    label: 'Engineering Mathematics',
    keywords: ['matrix', 'matrices', 'determinant', 'eigenvalue', 'eigenvector', 'differential equation', 'laplace', 'fourier', 'probability', 'statistics', 'mean', 'variance', 'integration', 'differentiation', 'limit', 'calculus', 'linear algebra', 'complex number', 'vector'],
    topics: {
      'linear-algebra': { label: 'Linear Algebra', keywords: ['matrix', 'determinant', 'eigenvalue', 'eigenvector', 'rank', 'inverse', 'linear transformation'] },
      'calculus': { label: 'Calculus', keywords: ['differentiation', 'integration', 'limit', 'maxima', 'minima', 'taylor', 'partial derivative'] },
      'probability': { label: 'Probability & Statistics', keywords: ['probability', 'random variable', 'distribution', 'mean', 'variance', 'bayes', 'poisson', 'binomial', 'normal'] },
      'differential-equations': { label: 'Differential Equations', keywords: ['differential equation', 'ode', 'pde', 'laplace', 'fourier'] },
    }
  },
  'data-structures': {
    label: 'Data Structures',
    keywords: ['array', 'linked list', 'stack', 'queue', 'tree', 'binary tree', 'bst', 'avl', 'heap', 'graph', 'hash', 'hashing', 'trie'],
    topics: {
      'arrays-linked-lists': { label: 'Arrays & Linked Lists', keywords: ['array', 'linked list', 'doubly linked', 'circular'] },
      'stacks-queues': { label: 'Stacks & Queues', keywords: ['stack', 'queue', 'deque', 'priority queue', 'infix', 'postfix', 'prefix'] },
      'trees': { label: 'Trees', keywords: ['tree', 'binary tree', 'bst', 'binary search tree', 'avl', 'red black', 'b tree', 'b+ tree', 'traversal', 'inorder', 'preorder', 'postorder'] },
      'graphs': { label: 'Graphs', keywords: ['graph', 'bfs', 'dfs', 'dijkstra', 'bellman', 'floyd', 'prim', 'kruskal', 'mst', 'shortest path', 'topological'] },
      'hashing': { label: 'Hashing', keywords: ['hash', 'hashing', 'collision', 'chaining', 'open addressing', 'load factor'] },
      'heaps': { label: 'Heaps', keywords: ['heap', 'min heap', 'max heap', 'heapify', 'priority queue'] },
    }
  },
  'algorithms': {
    label: 'Algorithms',
    keywords: ['algorithm', 'complexity', 'sorting', 'searching', 'divide and conquer', 'dynamic programming', 'greedy', 'backtracking', 'time complexity', 'space complexity', 'big o', 'recurrence'],
    topics: {
      'complexity-analysis': { label: 'Complexity Analysis', keywords: ['time complexity', 'space complexity', 'big o', 'theta', 'omega', 'asymptotic', 'recurrence', 'master theorem'] },
      'sorting-searching': { label: 'Sorting & Searching', keywords: ['sort', 'search', 'binary search', 'merge sort', 'quick sort', 'heap sort', 'bubble sort', 'insertion sort', 'selection sort', 'radix sort', 'counting sort'] },
      'divide-conquer': { label: 'Divide and Conquer', keywords: ['divide and conquer', 'merge sort', 'quick sort', 'binary search', 'strassen'] },
      'dynamic-programming': { label: 'Dynamic Programming', keywords: ['dynamic programming', 'dp', 'memoization', 'tabulation', 'knapsack', 'lcs', 'longest common subsequence', 'optimal substructure', 'overlapping subproblem'] },
      'greedy-algorithms': { label: 'Greedy Algorithms', keywords: ['greedy', 'activity selection', 'huffman', 'fractional knapsack', 'job scheduling'] },
    }
  },
  'dbms': {
    label: 'Database Management Systems',
    keywords: ['database', 'sql', 'relational', 'normalization', 'transaction', 'acid', 'er model', 'schema', 'query', 'join', 'index', 'key', 'primary key', 'foreign key'],
    topics: {
      'er-model': { label: 'ER Model', keywords: ['er model', 'entity', 'relationship', 'attribute', 'cardinality', 'participation'] },
      'relational-model': { label: 'Relational Model', keywords: ['relational', 'relation', 'tuple', 'attribute', 'domain', 'relational algebra', 'relational calculus'] },
      'sql': { label: 'SQL', keywords: ['sql', 'select', 'insert', 'update', 'delete', 'join', 'inner join', 'outer join', 'group by', 'having', 'aggregate', 'subquery', 'view'] },
      'normalization': { label: 'Normalization', keywords: ['normalization', 'normal form', '1nf', '2nf', '3nf', 'bcnf', '4nf', '5nf', 'functional dependency', 'decomposition', 'lossless'] },
      'transactions': { label: 'Transactions & Concurrency', keywords: ['transaction', 'acid', 'atomicity', 'consistency', 'isolation', 'durability', 'schedule', 'serializability', 'lock', 'deadlock', 'two phase locking', '2pl'] },
      'indexing': { label: 'Indexing', keywords: ['index', 'b tree', 'b+ tree', 'hash index', 'clustering', 'primary index', 'secondary index'] },
    }
  },
  'operating-systems': {
    label: 'Operating Systems',
    keywords: ['process', 'thread', 'scheduling', 'memory', 'virtual memory', 'paging', 'segmentation', 'deadlock', 'synchronization', 'semaphore', 'mutex', 'file system', 'cpu scheduling'],
    topics: {
      'process-management': { label: 'Process Management', keywords: ['process', 'thread', 'pcb', 'context switch', 'fork', 'exec', 'ipc', 'inter process'] },
      'cpu-scheduling': { label: 'CPU Scheduling', keywords: ['scheduling', 'fcfs', 'sjf', 'srtf', 'round robin', 'priority', 'multilevel', 'turnaround time', 'waiting time', 'response time'] },
      'synchronization': { label: 'Process Synchronization', keywords: ['synchronization', 'critical section', 'mutex', 'semaphore', 'monitor', 'producer consumer', 'reader writer', 'dining philosopher'] },
      'deadlocks': { label: 'Deadlocks', keywords: ['deadlock', 'banker', 'resource allocation', 'safe state', 'unsafe state', 'deadlock prevention', 'deadlock avoidance', 'deadlock detection'] },
      'memory-management': { label: 'Memory Management', keywords: ['memory', 'paging', 'segmentation', 'virtual memory', 'page fault', 'page replacement', 'lru', 'fifo', 'optimal', 'tlb', 'page table', 'thrashing'] },
      'file-systems': { label: 'File Systems', keywords: ['file', 'directory', 'inode', 'allocation', 'contiguous', 'linked', 'indexed', 'fat', 'ntfs'] },
    }
  },
  'computer-networks': {
    label: 'Computer Networks',
    keywords: ['network', 'osi', 'tcp', 'ip', 'udp', 'http', 'dns', 'routing', 'switching', 'protocol', 'layer', 'packet', 'frame', 'socket', 'port'],
    topics: {
      'osi-tcp': { label: 'OSI & TCP/IP Models', keywords: ['osi', 'tcp/ip', 'layer', 'physical', 'data link', 'network', 'transport', 'session', 'presentation', 'application'] },
      'data-link-layer': { label: 'Data Link Layer', keywords: ['data link', 'mac', 'llc', 'framing', 'error detection', 'error correction', 'crc', 'hamming', 'sliding window', 'aloha', 'csma', 'ethernet'] },
      'network-layer': { label: 'Network Layer', keywords: ['network layer', 'ip', 'ipv4', 'ipv6', 'routing', 'rip', 'ospf', 'bgp', 'subnet', 'cidr', 'nat', 'icmp'] },
      'transport-layer': { label: 'Transport Layer', keywords: ['transport', 'tcp', 'udp', 'port', 'socket', 'congestion', 'flow control', 'three way handshake', 'connection'] },
      'application-layer': { label: 'Application Layer', keywords: ['application', 'http', 'https', 'ftp', 'smtp', 'dns', 'dhcp', 'telnet', 'ssh'] },
    }
  },
  'toc': {
    label: 'Theory of Computation',
    keywords: ['automata', 'grammar', 'language', 'dfa', 'nfa', 'pda', 'turing machine', 'regular', 'context free', 'decidable', 'undecidable', 'halting problem', 'cfg', 'cfl'],
    topics: {
      'finite-automata': { label: 'Finite Automata', keywords: ['dfa', 'nfa', 'finite automata', 'state', 'transition', 'acceptance', 'epsilon', 'nfa to dfa', 'minimization'] },
      'regular-languages': { label: 'Regular Languages', keywords: ['regular', 'regular expression', 'regex', 'pumping lemma', 'regular grammar', 'closure'] },
      'cfg-pda': { label: 'CFG & PDA', keywords: ['cfg', 'context free grammar', 'pda', 'pushdown automata', 'cnf', 'gnf', 'chomsky', 'derivation', 'parse tree', 'ambiguity'] },
      'turing-machines': { label: 'Turing Machines', keywords: ['turing machine', 'tm', 'tape', 'computation', 'recursive', 'recursively enumerable'] },
      'decidability': { label: 'Decidability', keywords: ['decidable', 'undecidable', 'halting problem', 'rice theorem', 'reduction', 'recursive', 're'] },
    }
  },
  'compiler-design': {
    label: 'Compiler Design',
    keywords: ['compiler', 'lexical', 'syntax', 'semantic', 'parser', 'lexer', 'token', 'grammar', 'parsing', 'll', 'lr', 'lalr', 'slr', 'code generation', 'optimization'],
    topics: {
      'lexical-analysis': { label: 'Lexical Analysis', keywords: ['lexical', 'lexer', 'scanner', 'token', 'lexeme', 'pattern', 'regular expression'] },
      'parsing': { label: 'Syntax Analysis', keywords: ['parsing', 'parser', 'syntax', 'll(1)', 'lr(0)', 'slr', 'lalr', 'lr(1)', 'first', 'follow', 'shift', 'reduce', 'handle'] },
      'syntax-directed': { label: 'Syntax Directed Translation', keywords: ['sdt', 'syntax directed', 'attribute', 'synthesized', 'inherited', 's-attributed', 'l-attributed'] },
      'code-optimization': { label: 'Code Optimization', keywords: ['optimization', 'code generation', 'intermediate code', 'three address', 'dag', 'basic block', 'peephole', 'loop optimization'] },
    }
  },
  'digital-logic': {
    label: 'Digital Logic',
    keywords: ['boolean', 'logic gate', 'and', 'or', 'not', 'nand', 'nor', 'xor', 'flip flop', 'counter', 'register', 'multiplexer', 'demultiplexer', 'decoder', 'encoder', 'combinational', 'sequential'],
    topics: {
      'boolean-algebra': { label: 'Boolean Algebra', keywords: ['boolean', 'boolean algebra', 'karnaugh', 'k-map', 'sop', 'pos', 'minterm', 'maxterm', 'simplification'] },
      'combinational-circuits': { label: 'Combinational Circuits', keywords: ['combinational', 'multiplexer', 'mux', 'demux', 'decoder', 'encoder', 'adder', 'subtractor', 'comparator'] },
      'sequential-circuits': { label: 'Sequential Circuits', keywords: ['sequential', 'flip flop', 'sr', 'jk', 'd flip flop', 't flip flop', 'latch', 'counter', 'register', 'state machine', 'mealy', 'moore'] },
    }
  },
  'computer-organization': {
    label: 'Computer Organization & Architecture',
    keywords: ['cpu', 'processor', 'instruction', 'pipeline', 'cache', 'memory hierarchy', 'addressing mode', 'risc', 'cisc', 'io', 'dma', 'interrupt'],
    topics: {
      'cpu-architecture': { label: 'CPU Architecture', keywords: ['cpu', 'alu', 'control unit', 'instruction', 'instruction cycle', 'fetch', 'decode', 'execute', 'addressing mode', 'risc', 'cisc'] },
      'pipelining': { label: 'Pipelining', keywords: ['pipeline', 'hazard', 'data hazard', 'control hazard', 'structural hazard', 'forwarding', 'stall', 'branch prediction'] },
      'memory-hierarchy': { label: 'Memory Hierarchy', keywords: ['cache', 'memory', 'hit', 'miss', 'hit rate', 'miss rate', 'direct mapped', 'set associative', 'fully associative', 'write through', 'write back'] },
      'io-systems': { label: 'I/O Systems', keywords: ['io', 'input output', 'dma', 'interrupt', 'polling', 'programmed io', 'memory mapped'] },
    }
  },
};

function PaperUploadModal({ isOpen, onClose, onQuestionsExtracted, options }) {
  const [step, setStep] = useState(1); // 1: Upload, 2: Processing, 3: Review
  const [uploadMethod, setUploadMethod] = useState('text'); // 'text', 'file'
  const [rawText, setRawText] = useState('');
  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');
  const [extractedQuestions, setExtractedQuestions] = useState([]);
  const [error, setError] = useState('');
  const [year, setYear] = useState('');
  const [defaultSubject, setDefaultSubject] = useState('');

  const resetState = () => {
    setStep(1);
    setRawText('');
    setFile(null);
    setExtractedQuestions([]);
    setError('');
    setProcessing(false);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  // Extract text from PDF
  const extractTextFromPDF = async (arrayBuffer) => {
    setProcessingStatus('Loading PDF...');
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      setProcessingStatus(`Extracting page ${i} of ${pdf.numPages}...`);
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += pageText + '\n\n';
    }
    
    return fullText;
  };

  // Extract text from Image using OCR
  const extractTextFromImage = async (file) => {
    setProcessingStatus('Performing OCR on image...');
    const result = await Tesseract.recognize(file, 'eng', {
      logger: m => {
        if (m.status === 'recognizing text') {
          setProcessingStatus(`OCR Progress: ${Math.round(m.progress * 100)}%`);
        }
      }
    });
    return result.data.text;
  };

  // Classify question into subject and topic
  const classifyQuestion = (questionText) => {
    const text = questionText.toLowerCase();
    let bestSubject = defaultSubject || 'data-structures';
    let bestTopic = '';
    let maxScore = 0;

    for (const [subjectKey, subjectData] of Object.entries(GATE_TAXONOMY)) {
      let subjectScore = 0;
      
      // Check subject keywords
      for (const keyword of subjectData.keywords) {
        if (text.includes(keyword.toLowerCase())) {
          subjectScore += 2;
        }
      }

      // Check topic keywords
      let bestTopicForSubject = '';
      let bestTopicScore = 0;

      for (const [topicKey, topicData] of Object.entries(subjectData.topics)) {
        let topicScore = 0;
        for (const keyword of topicData.keywords) {
          if (text.includes(keyword.toLowerCase())) {
            topicScore += 3;
            subjectScore += 1;
          }
        }
        if (topicScore > bestTopicScore) {
          bestTopicScore = topicScore;
          bestTopicForSubject = topicKey;
        }
      }

      if (subjectScore > maxScore) {
        maxScore = subjectScore;
        bestSubject = subjectKey;
        bestTopic = bestTopicForSubject || Object.keys(subjectData.topics)[0];
      }
    }

    // If no topic found, use first topic of subject
    if (!bestTopic && GATE_TAXONOMY[bestSubject]) {
      bestTopic = Object.keys(GATE_TAXONOMY[bestSubject].topics)[0];
    }

    return { subject: bestSubject, topic: bestTopic };
  };

  // Detect question type
  const detectQuestionType = (questionText, options) => {
    const text = questionText.toLowerCase();
    
    // Check for MCQ indicators
    if (options && options.length >= 2) return 'MCQ';
    if (text.includes('(a)') && text.includes('(b)')) return 'MCQ';
    if (/\([a-d]\)/.test(text) || /[a-d]\)/.test(text)) return 'MCQ';
    
    // Check for numerical
    if (text.includes('calculate') || text.includes('compute') || text.includes('find the value') || 
        text.includes('determine') || text.includes('how many') || text.includes('what is the value')) {
      return 'Numerical';
    }
    
    // Default to descriptive
    return 'Descriptive';
  };

  // Parse questions from text
  const parseQuestions = (text) => {
    const questions = [];
    
    // Clean and normalize text
    let cleanText = text
      .replace(/\r\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    // Multiple patterns to detect questions
    const patterns = [
      // Pattern 1: Q.1, Q1, Q 1, Question 1
      /(?:Q\.?\s*|Question\s*)(\d+)\s*[\.\):]?\s*(.*?)(?=(?:Q\.?\s*|Question\s*)\d+|$)/gis,
      // Pattern 2: 1., 1), 1:
      /(?:^|\n)\s*(\d+)\s*[\.\):\]]\s*(.*?)(?=(?:^|\n)\s*\d+\s*[\.\):\]]|$)/gis,
      // Pattern 3: Questions separated by blank lines with numbering
      /(?:^|\n\n)\s*(?:Q\.?\s*)?(\d+)[\.\):]?\s*(.*?)(?=\n\n\s*(?:Q\.?\s*)?\d+[\.\):]?|$)/gis,
    ];

    let matches = [];
    
    // Try each pattern
    for (const pattern of patterns) {
      const patternMatches = [...cleanText.matchAll(pattern)];
      if (patternMatches.length > matches.length) {
        matches = patternMatches;
      }
    }

    // If no structured questions found, split by double newlines
    if (matches.length === 0) {
      const paragraphs = cleanText.split(/\n\n+/).filter(p => p.trim().length > 20);
      paragraphs.forEach((para, idx) => {
        matches.push([para, idx + 1, para]);
      });
    }

    matches.forEach((match, idx) => {
      let questionText = (match[2] || match[0]).trim();
      if (!questionText || questionText.length < 10) return;

      // Extract marks if mentioned
      let marks = 1;
      const marksMatch = questionText.match(/\[?\s*(\d+)\s*marks?\s*\]?/i) || 
                         questionText.match(/\(\s*(\d+)\s*marks?\s*\)/i) ||
                         questionText.match(/marks?\s*[:=]\s*(\d+)/i);
      if (marksMatch) {
        marks = parseInt(marksMatch[1]);
        questionText = questionText.replace(marksMatch[0], '').trim();
      }

      // Extract options if present
      let extractedOptions = [];
      const optionPatterns = [
        /\(([a-d])\)\s*([^(]+?)(?=\([a-d]\)|$)/gi,
        /([a-d])\)\s*([^a-d\)]+?)(?=[a-d]\)|$)/gi,
        /([a-d])\.\s*([^a-d\.]+?)(?=[a-d]\.|$)/gi,
      ];

      for (const optPattern of optionPatterns) {
        const optMatches = [...questionText.matchAll(optPattern)];
        if (optMatches.length >= 2) {
          extractedOptions = optMatches.map(m => m[2].trim());
          // Remove options from question text
          const firstOptIdx = questionText.search(/\([a-d]\)|[a-d]\)|[a-d]\./i);
          if (firstOptIdx > 0) {
            questionText = questionText.substring(0, firstOptIdx).trim();
          }
          break;
        }
      }

      // Ensure we have 4 options for MCQ
      while (extractedOptions.length > 0 && extractedOptions.length < 4) {
        extractedOptions.push('');
      }

      // Classify the question
      const classification = classifyQuestion(questionText);
      const questionType = detectQuestionType(questionText, extractedOptions);

      // Determine difficulty based on marks
      let difficulty = 'Medium';
      if (marks === 1) difficulty = 'Easy';
      else if (marks >= 3) difficulty = 'Hard';

      questions.push({
        id: `temp-${idx + 1}`,
        questionNumber: parseInt(match[1]) || idx + 1,
        question: questionText,
        options: extractedOptions.length >= 2 ? extractedOptions : ['', '', '', ''],
        correctAnswer: 0,
        explanation: '',
        subject: classification.subject,
        topic: classification.topic,
        difficulty,
        type: questionType,
        marks,
        negativeMarks: marks === 1 ? 0.33 : 0.66,
        year: year || null,
        isValid: true,
        expanded: false,
      });
    });

    return questions;
  };

  // Handle file upload
  const handleFileUpload = async (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    setError('');
  };

  // Process the input
  const processInput = async () => {
    setProcessing(true);
    setError('');
    setStep(2);

    try {
      let textToProcess = '';

      if (uploadMethod === 'text') {
        textToProcess = rawText;
      } else if (file) {
        const fileType = file.type;
        
        if (fileType === 'application/pdf') {
          const arrayBuffer = await file.arrayBuffer();
          textToProcess = await extractTextFromPDF(arrayBuffer);
        } else if (fileType.startsWith('image/')) {
          textToProcess = await extractTextFromImage(file);
        } else if (fileType === 'text/plain') {
          textToProcess = await file.text();
        } else {
          throw new Error('Unsupported file type. Please upload PDF, image, or text file.');
        }
      }

      if (!textToProcess.trim()) {
        throw new Error('No text content found to process.');
      }

      setProcessingStatus('Parsing questions...');
      const questions = parseQuestions(textToProcess);

      if (questions.length === 0) {
        throw new Error('Could not extract any questions. Please check the format.');
      }

      setProcessingStatus('Classifying questions...');
      setExtractedQuestions(questions);
      setStep(3);
    } catch (err) {
      setError(err.message);
      setStep(1);
    } finally {
      setProcessing(false);
    }
  };

  // Update a single question
  const updateQuestion = (id, field, value) => {
    setExtractedQuestions(prev => prev.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    ));
  };

  // Update question option
  const updateQuestionOption = (id, optionIndex, value) => {
    setExtractedQuestions(prev => prev.map(q => {
      if (q.id === id) {
        const newOptions = [...q.options];
        newOptions[optionIndex] = value;
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };

  // Toggle question expansion
  const toggleExpand = (id) => {
    setExtractedQuestions(prev => prev.map(q => 
      q.id === id ? { ...q, expanded: !q.expanded } : q
    ));
  };

  // Remove a question
  const removeQuestion = (id) => {
    setExtractedQuestions(prev => prev.filter(q => q.id !== id));
  };

  // Save all questions
  const handleSaveAll = () => {
    const validQuestions = extractedQuestions.filter(q => 
      q.question.trim() && q.subject && q.topic
    );
    onQuestionsExtracted(validQuestions);
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <FileUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Import Question Paper</h2>
              <p className="text-sm text-white/80">
                {step === 1 && 'Upload or paste your question paper'}
                {step === 2 && 'Processing your document...'}
                {step === 3 && `Review ${extractedQuestions.length} extracted questions`}
              </p>
            </div>
          </div>
          <button onClick={handleClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Step 1: Upload */}
          {step === 1 && (
            <div className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2 text-red-700">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  {error}
                </div>
              )}

              {/* Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year (Optional)</label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Not a PYQ</option>
                    {options.years?.map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Default Subject</label>
                  <select
                    value={defaultSubject}
                    onChange={(e) => setDefaultSubject(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Auto-detect</option>
                    {options.subjects?.map(s => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Upload Method Tabs */}
              <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
                <button
                  onClick={() => setUploadMethod('text')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                    uploadMethod === 'text' 
                      ? 'bg-white text-purple-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <FileText className="w-5 h-5" />
                  Paste Text
                </button>
                <button
                  onClick={() => setUploadMethod('file')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                    uploadMethod === 'file' 
                      ? 'bg-white text-purple-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Upload className="w-5 h-5" />
                  Upload File
                </button>
              </div>

              {/* Text Input */}
              {uploadMethod === 'text' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Paste Question Paper Content
                  </label>
                  <textarea
                    value={rawText}
                    onChange={(e) => setRawText(e.target.value)}
                    className="w-full h-64 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-sm"
                    placeholder={`Paste your questions here. Example format:\n\nQ.1 What is the time complexity of binary search? [2 marks]\n(a) O(1)\n(b) O(log n)\n(c) O(n)\n(d) O(n²)\n\nQ.2 Which data structure uses LIFO principle?\n(a) Queue\n(b) Stack\n(c) Linked List\n(d) Tree`}
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Supports various formats: Q.1, Question 1, numbered lists, etc.
                  </p>
                </div>
              )}

              {/* File Upload */}
              {uploadMethod === 'file' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Question Paper
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-purple-400 transition-colors">
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      accept=".pdf,.png,.jpg,.jpeg,.txt"
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      {file ? (
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center">
                            {file.type === 'application/pdf' ? (
                              <FileText className="w-8 h-8 text-purple-600" />
                            ) : (
                              <Image className="w-8 h-8 text-purple-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{file.name}</p>
                            <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                          </div>
                          <button
                            onClick={(e) => { e.preventDefault(); setFile(null); }}
                            className="text-sm text-red-600 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center">
                            <Upload className="w-8 h-8 text-gray-400" />
                          </div>
                          <div>
                            <p className="text-gray-900 font-medium">Click to upload or drag & drop</p>
                            <p className="text-sm text-gray-500 mt-1">PDF, PNG, JPG, or TXT (max 10MB)</p>
                          </div>
                        </div>
                      )}
                    </label>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-3 text-center text-sm">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <FileText className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                      <p className="font-medium text-blue-700">PDF</p>
                      <p className="text-blue-600 text-xs">Text extraction</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <Image className="w-6 h-6 text-green-600 mx-auto mb-1" />
                      <p className="font-medium text-green-700">Images</p>
                      <p className="text-green-600 text-xs">OCR processing</p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <ScanLine className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                      <p className="font-medium text-purple-700">Text</p>
                      <p className="text-purple-600 text-xs">Direct parsing</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Processing */}
          {step === 2 && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Processing Document</h3>
              <p className="text-gray-600">{processingStatus}</p>
              <div className="mt-6 w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse" style={{ width: '60%' }}></div>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="space-y-4">
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-purple-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-purple-600 mb-1">
                    <Hash className="w-4 h-4" />
                    <span className="text-sm font-medium">Total</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-700">{extractedQuestions.length}</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-blue-600 mb-1">
                    <BookOpen className="w-4 h-4" />
                    <span className="text-sm font-medium">MCQs</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-700">
                    {extractedQuestions.filter(q => q.type === 'MCQ').length}
                  </p>
                </div>
                <div className="bg-green-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-green-600 mb-1">
                    <Award className="w-4 h-4" />
                    <span className="text-sm font-medium">Numerical</span>
                  </div>
                  <p className="text-2xl font-bold text-green-700">
                    {extractedQuestions.filter(q => q.type === 'Numerical').length}
                  </p>
                </div>
                <div className="bg-orange-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-orange-600 mb-1">
                    <Tag className="w-4 h-4" />
                    <span className="text-sm font-medium">Subjects</span>
                  </div>
                  <p className="text-2xl font-bold text-orange-700">
                    {new Set(extractedQuestions.map(q => q.subject)).size}
                  </p>
                </div>
              </div>

              {/* Questions List */}
              <div className="space-y-3">
                {extractedQuestions.map((q, idx) => (
                  <div key={q.id} className="border border-gray-200 rounded-xl overflow-hidden">
                    {/* Question Header */}
                    <div 
                      className="p-4 bg-gray-50 flex items-center gap-4 cursor-pointer hover:bg-gray-100"
                      onClick={() => toggleExpand(q.id)}
                    >
                      <span className="w-8 h-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center font-semibold text-sm">
                        {idx + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 truncate">{q.question}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">
                            {GATE_TAXONOMY[q.subject]?.label || q.subject}
                          </span>
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                            {q.type}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-xs ${
                            q.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                            q.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {q.difficulty}
                          </span>
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                            {q.marks} mark{q.marks > 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); removeQuestion(q.id); }}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      {q.expanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                    </div>

                    {/* Expanded Edit Form */}
                    {q.expanded && (
                      <div className="p-4 space-y-4 border-t border-gray-200">
                        {/* Question Text */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
                          <textarea
                            value={q.question}
                            onChange={(e) => updateQuestion(q.id, 'question', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                            rows={3}
                          />
                        </div>

                        {/* Options */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Options (Select correct answer)</label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {q.options.map((opt, optIdx) => (
                              <div key={optIdx} className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  name={`correct-${q.id}`}
                                  checked={q.correctAnswer === optIdx}
                                  onChange={() => updateQuestion(q.id, 'correctAnswer', optIdx)}
                                  className="w-4 h-4 text-purple-600"
                                />
                                <span className="text-sm font-medium text-gray-500">{String.fromCharCode(65 + optIdx)}.</span>
                                <input
                                  type="text"
                                  value={opt}
                                  onChange={(e) => updateQuestionOption(q.id, optIdx, e.target.value)}
                                  className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                  placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Classification */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Subject</label>
                            <select
                              value={q.subject}
                              onChange={(e) => {
                                const newSubject = e.target.value;
                                const firstTopic = Object.keys(GATE_TAXONOMY[newSubject]?.topics || {})[0] || '';
                                updateQuestion(q.id, 'subject', newSubject);
                                updateQuestion(q.id, 'topic', firstTopic);
                              }}
                              className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                              {Object.entries(GATE_TAXONOMY).map(([key, val]) => (
                                <option key={key} value={key}>{val.label}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Topic</label>
                            <select
                              value={q.topic}
                              onChange={(e) => updateQuestion(q.id, 'topic', e.target.value)}
                              className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                              {Object.entries(GATE_TAXONOMY[q.subject]?.topics || {}).map(([key, val]) => (
                                <option key={key} value={key}>{val.label}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Difficulty</label>
                            <select
                              value={q.difficulty}
                              onChange={(e) => updateQuestion(q.id, 'difficulty', e.target.value)}
                              className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                              <option value="Easy">Easy</option>
                              <option value="Medium">Medium</option>
                              <option value="Hard">Hard</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Marks</label>
                            <input
                              type="number"
                              value={q.marks}
                              onChange={(e) => updateQuestion(q.id, 'marks', parseInt(e.target.value) || 1)}
                              className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                              min={1}
                            />
                          </div>
                        </div>

                        {/* Explanation */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Explanation (Optional)</label>
                          <textarea
                            value={q.explanation}
                            onChange={(e) => updateQuestion(q.id, 'explanation', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                            rows={2}
                            placeholder="Add explanation for the correct answer..."
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex items-center justify-between bg-gray-50">
          {step === 1 && (
            <>
              <p className="text-sm text-gray-500">
                {uploadMethod === 'text' 
                  ? `${rawText.length} characters entered` 
                  : file ? `File: ${file.name}` : 'No file selected'}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleClose}
                  className="px-6 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={processInput}
                  disabled={uploadMethod === 'text' ? !rawText.trim() : !file}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Wand2 className="w-4 h-4" />
                  Extract Questions
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <button
                onClick={() => setStep(1)}
                className="px-6 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                ← Back to Upload
              </button>
              <div className="flex gap-3">
                <button
                  onClick={handleClose}
                  className="px-6 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveAll}
                  disabled={extractedQuestions.length === 0}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Import {extractedQuestions.length} Questions
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default PaperUploadModal;
