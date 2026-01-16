import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'gate-prep-secret-key-2026';

// Middleware
app.use(cors());
app.use(express.json());

// JSON-based database file
const DB_FILE = join(__dirname, 'data.json');

// Initialize or load database
function loadDB() {
  if (fs.existsSync(DB_FILE)) {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
  }
  return initializeDB();
}

function saveDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

function initializeDB() {
  const data = {
    users: [
      {
        id: 1,
        name: 'Demo User',
        email: 'demo@gateprep.com',
        password: bcrypt.hashSync('demo123', 10),
        branch: 'Computer Science (CS)',
        createdAt: new Date().toISOString()
      }
    ],
    admins: [
      {
        id: 1,
        name: 'Admin',
        email: 'admin@gateprep.com',
        password: bcrypt.hashSync('admin123', 10),
        role: 'superadmin',
        createdAt: new Date().toISOString()
      }
    ],
    questions: getInitialQuestions(),
    tests: getInitialTests(),
    userAttempts: [],
    testResults: [],
    bookmarks: []
  };
  saveDB(data);
  return data;
}

function getInitialQuestions() {
  return [
    // Data Structures - Trees
    {
      id: 1,
      subject: 'data-structures',
      topic: 'trees',
      question: 'What is the time complexity of searching for an element in a balanced Binary Search Tree?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
      correctAnswer: 1,
      explanation: 'In a balanced BST, the height is O(log n). Since search operation traverses from root to leaf in the worst case, the time complexity is O(log n).',
      difficulty: 'Easy',
      year: null,
      marks: 1,
      negativeMarks: 0.33
    },
    {
      id: 2,
      subject: 'data-structures',
      topic: 'trees',
      question: 'Which of the following is NOT a property of a Binary Search Tree?',
      options: [
        'Left subtree contains only nodes with keys less than the node\'s key',
        'Right subtree contains only nodes with keys greater than the node\'s key',
        'Both left and right subtrees must also be binary search trees',
        'The tree must be complete'
      ],
      correctAnswer: 3,
      explanation: 'A BST does not need to be complete. A complete binary tree is one where all levels except possibly the last are completely filled.',
      difficulty: 'Medium',
      year: null,
      marks: 1,
      negativeMarks: 0.33
    },
    {
      id: 3,
      subject: 'data-structures',
      topic: 'trees',
      question: 'The worst-case time complexity of inserting n elements into an initially empty Binary Search Tree is:',
      options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
      correctAnswer: 2,
      explanation: 'If elements are inserted in sorted order, the BST degenerates into a linked list. Each insertion takes O(n) time, so n insertions take O(n²) time.',
      difficulty: 'Medium',
      year: 'GATE 2019',
      marks: 2,
      negativeMarks: 0.66
    },
    {
      id: 4,
      subject: 'data-structures',
      topic: 'trees',
      question: 'What is the minimum number of nodes in an AVL tree of height 3?',
      options: ['5', '7', '9', '12'],
      correctAnswer: 1,
      explanation: 'The minimum number of nodes in an AVL tree follows N(h) = N(h-1) + N(h-2) + 1. For h=3: N(3) = N(2) + N(1) + 1 = 4 + 2 + 1 = 7.',
      difficulty: 'Hard',
      year: 'GATE 2018',
      marks: 2,
      negativeMarks: 0.66
    },
    {
      id: 5,
      subject: 'data-structures',
      topic: 'trees',
      question: 'In a complete binary tree with n nodes, what is the maximum height?',
      options: ['log₂(n)', '⌊log₂(n)⌋', '⌈log₂(n+1)⌉ - 1', 'n-1'],
      correctAnswer: 2,
      explanation: 'In a complete binary tree, the height is ⌈log₂(n+1)⌉ - 1 or equivalently ⌊log₂(n)⌋.',
      difficulty: 'Medium',
      year: null,
      marks: 1,
      negativeMarks: 0.33
    },
    // Data Structures - Arrays & Linked Lists
    {
      id: 6,
      subject: 'data-structures',
      topic: 'arrays-linked-lists',
      question: 'What is the time complexity of inserting an element at the beginning of an array?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
      correctAnswer: 2,
      explanation: 'To insert at the beginning, all existing elements must be shifted right, which takes O(n) time.',
      difficulty: 'Easy',
      year: null,
      marks: 1,
      negativeMarks: 0.33
    },
    {
      id: 7,
      subject: 'data-structures',
      topic: 'arrays-linked-lists',
      question: 'Which operation has O(1) time complexity in a doubly linked list if we have a pointer to the node?',
      options: ['Search', 'Deletion', 'Finding middle element', 'Sorting'],
      correctAnswer: 1,
      explanation: 'In a doubly linked list, if we have a pointer to the node, deletion takes O(1) as we can directly update prev and next pointers.',
      difficulty: 'Easy',
      year: 'GATE 2020',
      marks: 1,
      negativeMarks: 0.33
    },
    // Data Structures - Sorting & Searching
    {
      id: 8,
      subject: 'data-structures',
      topic: 'sorting-searching',
      question: 'Which sorting algorithm has the best average case time complexity?',
      options: ['Bubble Sort O(n²)', 'Merge Sort O(n log n)', 'Insertion Sort O(n²)', 'Selection Sort O(n²)'],
      correctAnswer: 1,
      explanation: 'Merge Sort has O(n log n) average case time complexity which is better than O(n²) of other options.',
      difficulty: 'Easy',
      year: null,
      marks: 1,
      negativeMarks: 0.33
    },
    {
      id: 9,
      subject: 'data-structures',
      topic: 'sorting-searching',
      question: 'What is the recurrence relation for Merge Sort?',
      options: ['T(n) = T(n-1) + O(n)', 'T(n) = 2T(n/2) + O(n)', 'T(n) = T(n/2) + O(1)', 'T(n) = 2T(n-1) + O(1)'],
      correctAnswer: 1,
      explanation: 'Merge Sort divides the array into two halves (2T(n/2)) and then merges them (O(n)).',
      difficulty: 'Medium',
      year: 'GATE 2017',
      marks: 1,
      negativeMarks: 0.33
    },
    // Data Structures - Graphs
    {
      id: 10,
      subject: 'data-structures',
      topic: 'graphs',
      question: 'What is the time complexity of BFS traversal of a graph with V vertices and E edges?',
      options: ['O(V)', 'O(E)', 'O(V + E)', 'O(V × E)'],
      correctAnswer: 2,
      explanation: 'BFS visits each vertex once and each edge once (in undirected graph, twice for directed), giving O(V + E).',
      difficulty: 'Medium',
      year: null,
      marks: 1,
      negativeMarks: 0.33
    },
    {
      id: 11,
      subject: 'data-structures',
      topic: 'graphs',
      question: 'Which algorithm is used to find the shortest path in a weighted graph with negative edge weights (but no negative cycles)?',
      options: ['Dijkstra\'s Algorithm', 'Bellman-Ford Algorithm', 'Floyd-Warshall Algorithm', 'Prim\'s Algorithm'],
      correctAnswer: 1,
      explanation: 'Bellman-Ford algorithm can handle graphs with negative edge weights and can detect negative cycles.',
      difficulty: 'Medium',
      year: 'GATE 2019',
      marks: 2,
      negativeMarks: 0.66
    },
    // DBMS - Normalization
    {
      id: 12,
      subject: 'dbms',
      topic: 'normalization',
      question: 'Which normal form deals with multivalued dependencies?',
      options: ['2NF', '3NF', 'BCNF', '4NF'],
      correctAnswer: 3,
      explanation: '4NF (Fourth Normal Form) specifically deals with multivalued dependencies.',
      difficulty: 'Medium',
      year: 'GATE 2019',
      marks: 1,
      negativeMarks: 0.33
    },
    {
      id: 13,
      subject: 'dbms',
      topic: 'normalization',
      question: 'A relation is in BCNF if and only if every determinant is a:',
      options: ['Primary key', 'Candidate key', 'Foreign key', 'Super key'],
      correctAnswer: 3,
      explanation: 'A relation is in BCNF if for every functional dependency X → Y, X is a super key.',
      difficulty: 'Hard',
      year: 'GATE 2018',
      marks: 2,
      negativeMarks: 0.66
    },
    // DBMS - SQL
    {
      id: 14,
      subject: 'dbms',
      topic: 'sql',
      question: 'Which SQL clause is used to filter groups?',
      options: ['WHERE', 'HAVING', 'GROUP BY', 'ORDER BY'],
      correctAnswer: 1,
      explanation: 'HAVING clause is used to filter groups after GROUP BY, while WHERE filters rows before grouping.',
      difficulty: 'Easy',
      year: null,
      marks: 1,
      negativeMarks: 0.33
    },
    {
      id: 15,
      subject: 'dbms',
      topic: 'sql',
      question: 'The SQL query "SELECT * FROM table WHERE column IN (SELECT column FROM table2)" uses which type of subquery?',
      options: ['Scalar subquery', 'Column subquery', 'Row subquery', 'Table subquery'],
      correctAnswer: 1,
      explanation: 'A column subquery returns a single column with multiple rows, used with IN, ANY, ALL operators.',
      difficulty: 'Medium',
      year: 'GATE 2020',
      marks: 1,
      negativeMarks: 0.33
    },
    // DBMS - Transactions
    {
      id: 16,
      subject: 'dbms',
      topic: 'transactions',
      question: 'Which property of ACID ensures that a transaction is treated as a single unit?',
      options: ['Atomicity', 'Consistency', 'Isolation', 'Durability'],
      correctAnswer: 0,
      explanation: 'Atomicity ensures that either all operations of a transaction are completed or none are.',
      difficulty: 'Easy',
      year: 'GATE 2021',
      marks: 1,
      negativeMarks: 0.33
    },
    {
      id: 17,
      subject: 'dbms',
      topic: 'transactions',
      question: 'Two-phase locking protocol ensures:',
      options: ['Deadlock freedom', 'Serializability', 'Both deadlock freedom and serializability', 'Neither'],
      correctAnswer: 1,
      explanation: 'Two-phase locking ensures conflict serializability but does NOT prevent deadlocks.',
      difficulty: 'Medium',
      year: 'GATE 2017',
      marks: 2,
      negativeMarks: 0.66
    },
    // Operating Systems - Process Management
    {
      id: 18,
      subject: 'operating-systems',
      topic: 'process-management',
      question: 'Which scheduling algorithm can cause starvation?',
      options: ['Round Robin', 'FCFS', 'SJF', 'All of the above'],
      correctAnswer: 2,
      explanation: 'Shortest Job First (SJF) can cause starvation for longer processes if shorter ones keep arriving.',
      difficulty: 'Medium',
      year: null,
      marks: 1,
      negativeMarks: 0.33
    },
    {
      id: 19,
      subject: 'operating-systems',
      topic: 'process-management',
      question: 'The maximum number of processes that can be in the ready state at any time in a system with n processes is:',
      options: ['n', 'n-1', 'n-2', '1'],
      correctAnswer: 1,
      explanation: 'At any time, at least one process must be either running (on CPU) or blocked, so maximum n-1 processes can be ready.',
      difficulty: 'Medium',
      year: 'GATE 2018',
      marks: 1,
      negativeMarks: 0.33
    },
    // Operating Systems - Memory Management
    {
      id: 20,
      subject: 'operating-systems',
      topic: 'memory-management',
      question: 'In virtual memory, thrashing occurs when:',
      options: [
        'CPU utilization is very high',
        'The system spends more time paging than executing',
        'Multiple processes are in deadlock',
        'Memory fragmentation is high'
      ],
      correctAnswer: 1,
      explanation: 'Thrashing occurs when the system is constantly swapping pages in and out, spending more time on paging than actual execution.',
      difficulty: 'Medium',
      year: 'GATE 2018',
      marks: 2,
      negativeMarks: 0.66
    },
    {
      id: 21,
      subject: 'operating-systems',
      topic: 'memory-management',
      question: 'Page size is typically chosen to be a power of 2 because:',
      options: [
        'It makes memory allocation simpler',
        'It allows easy translation between logical and physical addresses using bit manipulation',
        'It reduces external fragmentation',
        'It increases TLB hit rate'
      ],
      correctAnswer: 1,
      explanation: 'Power of 2 page sizes allow logical address to physical address translation using simple bit manipulation (masking and concatenation).',
      difficulty: 'Easy',
      year: 'GATE 2019',
      marks: 1,
      negativeMarks: 0.33
    },
    // Operating Systems - Deadlocks
    {
      id: 22,
      subject: 'operating-systems',
      topic: 'deadlocks',
      question: 'The Banker\'s algorithm is used for:',
      options: ['Deadlock detection', 'Deadlock avoidance', 'Deadlock prevention', 'Deadlock recovery'],
      correctAnswer: 1,
      explanation: 'Banker\'s algorithm is a deadlock avoidance algorithm that checks if granting a resource request would leave the system in a safe state.',
      difficulty: 'Easy',
      year: 'GATE 2020',
      marks: 1,
      negativeMarks: 0.33
    },
    {
      id: 23,
      subject: 'operating-systems',
      topic: 'deadlocks',
      question: 'Which of the following is NOT a necessary condition for deadlock?',
      options: ['Mutual exclusion', 'Hold and wait', 'Preemption', 'Circular wait'],
      correctAnswer: 2,
      explanation: 'No preemption (not preemption) is a necessary condition for deadlock. If resources can be preempted, deadlock can be avoided.',
      difficulty: 'Easy',
      year: null,
      marks: 1,
      negativeMarks: 0.33
    },
    // Computer Networks - OSI/TCP
    {
      id: 24,
      subject: 'computer-networks',
      topic: 'osi-tcp',
      question: 'In TCP/IP, the protocol responsible for routing packets is:',
      options: ['TCP', 'UDP', 'IP', 'ICMP'],
      correctAnswer: 2,
      explanation: 'IP (Internet Protocol) is responsible for routing packets from source to destination across networks.',
      difficulty: 'Easy',
      year: null,
      marks: 1,
      negativeMarks: 0.33
    },
    {
      id: 25,
      subject: 'computer-networks',
      topic: 'osi-tcp',
      question: 'Which layer of the OSI model is responsible for end-to-end error recovery and flow control?',
      options: ['Network layer', 'Transport layer', 'Session layer', 'Data link layer'],
      correctAnswer: 1,
      explanation: 'The Transport layer (Layer 4) is responsible for end-to-end error recovery, flow control, and reliable data delivery.',
      difficulty: 'Easy',
      year: 'GATE 2021',
      marks: 1,
      negativeMarks: 0.33
    },
    // Computer Networks - Transport Layer
    {
      id: 26,
      subject: 'computer-networks',
      topic: 'transport-layer',
      question: 'Which protocol provides reliable data transfer?',
      options: ['UDP', 'IP', 'TCP', 'ICMP'],
      correctAnswer: 2,
      explanation: 'TCP (Transmission Control Protocol) provides reliable, ordered, and error-checked delivery of data.',
      difficulty: 'Easy',
      year: 'GATE 2019',
      marks: 1,
      negativeMarks: 0.33
    },
    {
      id: 27,
      subject: 'computer-networks',
      topic: 'transport-layer',
      question: 'In TCP, the sender window size is determined by:',
      options: [
        'Receiver window only',
        'Congestion window only',
        'Minimum of receiver window and congestion window',
        'Maximum of receiver window and congestion window'
      ],
      correctAnswer: 2,
      explanation: 'TCP sender window = min(receiver window, congestion window) to ensure both flow control and congestion control.',
      difficulty: 'Medium',
      year: 'GATE 2018',
      marks: 2,
      negativeMarks: 0.66
    },
    // Theory of Computation - Finite Automata
    {
      id: 28,
      subject: 'toc',
      topic: 'finite-automata',
      question: 'Which of the following is true about DFA and NFA?',
      options: [
        'DFA is more powerful than NFA',
        'NFA is more powerful than DFA',
        'DFA and NFA are equivalent in power',
        'DFA cannot be converted to NFA'
      ],
      correctAnswer: 2,
      explanation: 'DFA and NFA are equivalent in power - any language accepted by an NFA can also be accepted by some DFA.',
      difficulty: 'Medium',
      year: 'GATE 2017',
      marks: 1,
      negativeMarks: 0.33
    },
    {
      id: 29,
      subject: 'toc',
      topic: 'finite-automata',
      question: 'The number of states in the minimal DFA for the language L = {w | w has an odd number of 1s} over Σ = {0, 1} is:',
      options: ['1', '2', '3', '4'],
      correctAnswer: 1,
      explanation: 'Two states are sufficient: one for even count of 1s (initial) and one for odd count of 1s (final).',
      difficulty: 'Medium',
      year: 'GATE 2019',
      marks: 1,
      negativeMarks: 0.33
    },
    // Theory of Computation - CFG/PDA
    {
      id: 30,
      subject: 'toc',
      topic: 'cfg-pda',
      question: 'Context-free languages are closed under:',
      options: ['Union', 'Intersection', 'Complementation', 'All of the above'],
      correctAnswer: 0,
      explanation: 'CFLs are closed under union but NOT under intersection or complementation.',
      difficulty: 'Hard',
      year: 'GATE 2018',
      marks: 2,
      negativeMarks: 0.66
    },
    {
      id: 31,
      subject: 'toc',
      topic: 'cfg-pda',
      question: 'Which of the following languages is NOT context-free?',
      options: ['{aⁿbⁿ | n ≥ 0}', '{aⁿbⁿcⁿ | n ≥ 0}', '{aⁿbᵐ | n ≤ m}', '{ww^R | w ∈ {a,b}*}'],
      correctAnswer: 1,
      explanation: '{aⁿbⁿcⁿ} requires matching three different counts which cannot be done with a single stack (PDA).',
      difficulty: 'Hard',
      year: 'GATE 2020',
      marks: 2,
      negativeMarks: 0.66
    },
    // Algorithms - Dynamic Programming
    {
      id: 32,
      subject: 'algorithms',
      topic: 'dynamic-programming',
      question: 'The time complexity of the dynamic programming solution for the 0/1 Knapsack problem with n items and capacity W is:',
      options: ['O(n)', 'O(nW)', 'O(n²)', 'O(2ⁿ)'],
      correctAnswer: 1,
      explanation: 'The DP solution uses a 2D table of size n × W, filling each cell in O(1) time, giving O(nW) complexity.',
      difficulty: 'Medium',
      year: 'GATE 2019',
      marks: 2,
      negativeMarks: 0.66
    },
    {
      id: 33,
      subject: 'algorithms',
      topic: 'dynamic-programming',
      question: 'Which of the following problems CANNOT be solved using dynamic programming?',
      options: ['Longest Common Subsequence', 'Matrix Chain Multiplication', 'Travelling Salesman Problem', 'Quick Sort'],
      correctAnswer: 3,
      explanation: 'Quick Sort is a divide and conquer algorithm that doesn\'t have overlapping subproblems, which is required for DP.',
      difficulty: 'Medium',
      year: null,
      marks: 1,
      negativeMarks: 0.33
    },
    // Algorithms - Greedy Algorithms
    {
      id: 34,
      subject: 'algorithms',
      topic: 'greedy-algorithms',
      question: 'Which of the following is NOT solved optimally by a greedy approach?',
      options: ['Fractional Knapsack', '0/1 Knapsack', 'Activity Selection', 'Huffman Coding'],
      correctAnswer: 1,
      explanation: '0/1 Knapsack cannot be solved optimally by greedy approach because we cannot take fractions of items.',
      difficulty: 'Easy',
      year: 'GATE 2018',
      marks: 1,
      negativeMarks: 0.33
    },
    // Compiler Design - Parsing
    {
      id: 35,
      subject: 'compiler-design',
      topic: 'parsing',
      question: 'LL(1) parser is a type of:',
      options: ['Bottom-up parser', 'Top-down parser', 'Both top-down and bottom-up', 'Neither'],
      correctAnswer: 1,
      explanation: 'LL(1) is a top-down parser that reads input Left to right, produces Leftmost derivation, using 1 lookahead symbol.',
      difficulty: 'Easy',
      year: null,
      marks: 1,
      negativeMarks: 0.33
    },
    {
      id: 36,
      subject: 'compiler-design',
      topic: 'parsing',
      question: 'LR(1) parser is more powerful than SLR(1) parser because:',
      options: [
        'It uses more lookahead symbols',
        'It considers the context in which each item was derived',
        'It parses in both directions',
        'It can handle left recursion'
      ],
      correctAnswer: 1,
      explanation: 'LR(1) is more powerful because it uses lookahead sets specific to each item, considering the context in which the item was derived.',
      difficulty: 'Hard',
      year: 'GATE 2017',
      marks: 2,
      negativeMarks: 0.66
    },
    // Digital Logic
    {
      id: 37,
      subject: 'digital-logic',
      topic: 'boolean-algebra',
      question: 'The simplified expression for F = AB + A\'B + AB\' is:',
      options: ['A + B', 'A\'B\'', 'AB', 'A + B\''],
      correctAnswer: 0,
      explanation: 'F = AB + A\'B + AB\' = B(A + A\') + AB\' = B + AB\' = B + A (by absorption law complement).',
      difficulty: 'Medium',
      year: 'GATE 2020',
      marks: 1,
      negativeMarks: 0.33
    },
    {
      id: 38,
      subject: 'digital-logic',
      topic: 'combinational-circuits',
      question: 'A 4-to-1 multiplexer can be implemented using:',
      options: ['Two 2-to-1 multiplexers', 'Three 2-to-1 multiplexers', 'Four 2-to-1 multiplexers', 'One 2-to-1 multiplexer'],
      correctAnswer: 1,
      explanation: 'A 4-to-1 MUX needs three 2-to-1 MUXes: two at the first level to select pairs, one at the second level to select final output.',
      difficulty: 'Medium',
      year: 'GATE 2019',
      marks: 2,
      negativeMarks: 0.66
    },
    // Computer Organization
    {
      id: 39,
      subject: 'computer-organization',
      topic: 'cpu-architecture',
      question: 'In a pipelined processor with k stages, the maximum speedup achievable is:',
      options: ['k', 'k-1', 'k+1', '2k'],
      correctAnswer: 0,
      explanation: 'In ideal conditions with no pipeline hazards, a k-stage pipeline achieves speedup of k compared to non-pipelined execution.',
      difficulty: 'Easy',
      year: 'GATE 2018',
      marks: 1,
      negativeMarks: 0.33
    },
    {
      id: 40,
      subject: 'computer-organization',
      topic: 'memory-hierarchy',
      question: 'If cache hit rate is 90% and cache access time is 10ns, memory access time is 100ns, the average memory access time is:',
      options: ['19ns', '55ns', '91ns', '100ns'],
      correctAnswer: 0,
      explanation: 'Average access time = Hit rate × Cache time + Miss rate × Memory time = 0.9×10 + 0.1×100 = 9 + 10 = 19ns.',
      difficulty: 'Medium',
      year: 'GATE 2021',
      marks: 2,
      negativeMarks: 0.66
    },
  ];
}

function getInitialTests() {
  return [
    {
      id: 1,
      title: 'GATE CS Mock Test #1',
      description: 'Full-length practice test covering complete GATE CS syllabus',
      duration: 180,
      totalQuestions: 65,
      totalMarks: 100,
      difficulty: 'Medium',
      type: 'full',
      isActive: true
    },
    {
      id: 2,
      title: 'Data Structures Mini Test',
      description: 'Quick assessment of DS concepts - Arrays, Trees, Graphs',
      duration: 45,
      totalQuestions: 20,
      totalMarks: 30,
      difficulty: 'Easy',
      type: 'mini',
      isActive: true
    },
    {
      id: 3,
      title: 'DBMS Sectional Test',
      description: 'Complete DBMS section covering SQL, Normalization, Transactions',
      duration: 60,
      totalQuestions: 25,
      totalMarks: 40,
      difficulty: 'Medium',
      type: 'sectional',
      isActive: true
    },
    {
      id: 4,
      title: 'Operating Systems Practice Test',
      description: 'Process Management, Memory Management, Deadlocks',
      duration: 60,
      totalQuestions: 25,
      totalMarks: 40,
      difficulty: 'Medium',
      type: 'sectional',
      isActive: true
    },
    {
      id: 5,
      title: 'Theory of Computation Test',
      description: 'FA, PDA, Turing Machines, Decidability',
      duration: 45,
      totalQuestions: 20,
      totalMarks: 35,
      difficulty: 'Hard',
      type: 'sectional',
      isActive: true
    },
    {
      id: 6,
      title: 'GATE CS Full Mock #2',
      description: 'Complete GATE-level test with negative marking',
      duration: 180,
      totalQuestions: 65,
      totalMarks: 100,
      difficulty: 'Hard',
      type: 'full',
      isActive: true
    }
  ];
}

let db = loadDB();

// Ensure admins array exists in existing databases
if (!db.admins) {
  db.admins = [
    {
      id: 1,
      name: 'Admin',
      email: 'admin@gateprep.com',
      password: bcrypt.hashSync('admin123', 10),
      role: 'superadmin',
      createdAt: new Date().toISOString()
    }
  ];
  saveDB(db);
}

// Auth middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}

// Admin auth middleware
function authenticateAdmin(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Admin access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, admin) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid admin token' });
    }
    if (!admin.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' });
    }
    req.admin = admin;
    next();
  });
}

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, branch } = req.body;

    const existingUser = db.users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: db.users.length + 1,
      name,
      email,
      password: hashedPassword,
      branch,
      createdAt: new Date().toISOString()
    };
    
    db.users.push(newUser);
    saveDB(db);

    const userData = { id: newUser.id, name, email, branch };
    const token = jwt.sign(userData, JWT_SECRET, { expiresIn: '7d' });

    res.json({ user: userData, token });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = db.users.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const userData = { id: user.id, name: user.name, email: user.email, branch: user.branch };
    const token = jwt.sign(userData, JWT_SECRET, { expiresIn: '7d' });

    res.json({ user: userData, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  const user = db.users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json({ user: { id: user.id, name: user.name, email: user.email, branch: user.branch } });
});

// Dashboard Routes
app.get('/api/dashboard/stats', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;

    const userAttempts = db.userAttempts.filter(a => a.userId === userId);
    const correctAttempts = userAttempts.filter(a => a.isCorrect).length;
    const testsCompleted = db.testResults.filter(r => r.userId === userId).length;
    
    const userTestResults = db.testResults.filter(r => r.userId === userId);
    const averageScore = userTestResults.length > 0
      ? userTestResults.reduce((acc, r) => acc + r.score, 0) / userTestResults.length
      : 0;

    // Check if user has any activity
    const hasActivity = userAttempts.length > 0 || testsCompleted > 0;

    // Calculate actual streak based on activity dates
    let streak = 0;
    if (userAttempts.length > 0) {
      const sortedAttempts = [...userAttempts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      let checkDate = new Date(today);
      
      for (let i = 0; i < 30; i++) {
        const hasAttemptOnDay = sortedAttempts.some(a => {
          const attemptDate = new Date(a.createdAt);
          attemptDate.setHours(0, 0, 0, 0);
          return attemptDate.getTime() === checkDate.getTime();
        });
        if (hasAttemptOnDay) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else if (i > 0) {
          break;
        } else {
          checkDate.setDate(checkDate.getDate() - 1);
        }
      }
    }

    // Calculate weekly performance from actual test results
    const performanceData = [];
    if (userTestResults.length > 0) {
      const sortedResults = [...userTestResults].sort((a, b) => new Date(a.completedAt) - new Date(b.completedAt));
      sortedResults.slice(-6).forEach((result, idx) => {
        performanceData.push({
          date: `Test ${idx + 1}`,
          score: Math.round(result.score)
        });
      });
    }

    res.json({
      stats: hasActivity ? {
        questionsAttempted: userAttempts.length,
        testsCompleted,
        averageScore: Math.round(averageScore),
        studyHours: Math.floor(userAttempts.length / 10),
        streak,
        rank: null,
        accuracy: userAttempts.length > 0 ? Math.round((correctAttempts / userAttempts.length) * 100) : 0
      } : null,
      performanceData: performanceData.length > 0 ? performanceData : null,
      isNewUser: !hasActivity
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Error fetching dashboard stats' });
  }
});

// Questions Routes
app.get('/api/questions', authenticateToken, (req, res) => {
  try {
    res.json({ questions: db.questions, total: db.questions.length });
  } catch (error) {
    console.error('Questions fetch error:', error);
    res.status(500).json({ message: 'Error fetching questions' });
  }
});

app.get('/api/questions/:subject', authenticateToken, (req, res) => {
  try {
    const { subject } = req.params;
    const { topic, difficulty, year, limit = 50 } = req.query;

    let questions = db.questions.filter(q => q.subject === subject);

    if (topic) {
      questions = questions.filter(q => q.topic === topic);
    }
    if (difficulty && difficulty !== 'all') {
      questions = questions.filter(q => q.difficulty.toLowerCase() === difficulty.toLowerCase());
    }
    if (year) {
      questions = questions.filter(q => q.year === year);
    }

    res.json({ questions: questions.slice(0, parseInt(limit)), total: questions.length });
  } catch (error) {
    console.error('Questions fetch error:', error);
    res.status(500).json({ message: 'Error fetching questions' });
  }
});

app.get('/api/questions/:subject/:topic', authenticateToken, (req, res) => {
  try {
    const { subject, topic } = req.params;
    const { limit = 20, difficulty } = req.query;

    let questions = db.questions.filter(q => 
      q.subject === subject && q.topic === topic
    );

    if (difficulty && difficulty !== 'all') {
      questions = questions.filter(q => q.difficulty.toLowerCase() === difficulty.toLowerCase());
    }

    res.json({ questions: questions.slice(0, parseInt(limit)), total: questions.length });
  } catch (error) {
    console.error('Questions fetch error:', error);
    res.status(500).json({ message: 'Error fetching questions' });
  }
});

// PYQ Routes
app.get('/api/pyqs', authenticateToken, (req, res) => {
  try {
    const { year, subject } = req.query;
    
    let pyqs = db.questions.filter(q => q.year !== null);
    
    if (year) {
      pyqs = pyqs.filter(q => q.year === year);
    }
    if (subject) {
      pyqs = pyqs.filter(q => q.subject === subject);
    }

    const years = [...new Set(db.questions.filter(q => q.year).map(q => q.year))].sort().reverse();

    res.json({ questions: pyqs, years, total: pyqs.length });
  } catch (error) {
    console.error('PYQs fetch error:', error);
    res.status(500).json({ message: 'Error fetching PYQs' });
  }
});

app.post('/api/questions/attempt', authenticateToken, (req, res) => {
  try {
    const { questionId, selectedAnswer, isCorrect, timeTaken, testId } = req.body;
    const userId = req.user.id;

    const attempt = {
      id: db.userAttempts.length + 1,
      userId,
      questionId,
      selectedAnswer,
      isCorrect,
      timeTaken,
      testId: testId || null,
      attemptDate: new Date().toISOString()
    };
    
    db.userAttempts.push(attempt);
    saveDB(db);

    res.json({ success: true, attemptId: attempt.id });
  } catch (error) {
    console.error('Attempt save error:', error);
    res.status(500).json({ message: 'Error saving attempt' });
  }
});

// Tests Routes
app.get('/api/tests', (req, res) => {
  try {
    const tests = db.tests.filter(t => t.isActive).map(t => ({
      id: t.id,
      title: t.title,
      description: t.description || 'GATE Practice Test',
      duration: t.duration,
      questions: t.totalQuestions,
      marks: t.totalMarks || t.totalQuestions * 2,
      difficulty: t.difficulty || 'Medium',
      attempts: t.attempts || 0,
      avgScore: t.avgScore || 0,
      status: 'available',
      type: t.type || 'full',
    }));
    res.json(tests);
  } catch (error) {
    console.error('Tests fetch error:', error);
    res.status(500).json({ message: 'Error fetching tests' });
  }
});

// Get user test history
app.get('/api/user/test-history', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;
    const userResults = db.testResults.filter(r => r.userId === userId);
    
    const history = userResults.map(r => {
      const test = db.tests.find(t => t.id === r.testId);
      return {
        testId: r.testId,
        testName: test ? test.title : `Test #${r.testId}`,
        score: r.score,
        date: r.completedAt,
        rank: r.rank || Math.floor(Math.random() * 500) + 1,
      };
    });
    
    res.json(history);
  } catch (error) {
    console.error('Test history fetch error:', error);
    res.status(500).json({ message: 'Error fetching test history' });
  }
});

app.get('/api/tests/:testId', authenticateToken, (req, res) => {
  try {
    const { testId } = req.params;
    const test = db.tests.find(t => t.id === parseInt(testId));
    
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }
    
    res.json({ test });
  } catch (error) {
    console.error('Test fetch error:', error);
    res.status(500).json({ message: 'Error fetching test' });
  }
});

app.get('/api/tests/:testId/questions', authenticateToken, (req, res) => {
  try {
    const { testId } = req.params;
    const test = db.tests.find(t => t.id === parseInt(testId));
    
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }

    // Get questions based on test type and shuffle them
    let questions = [...db.questions];
    
    // Shuffle and limit based on test configuration
    questions = questions.sort(() => Math.random() - 0.5).slice(0, test.totalQuestions);
    
    res.json({ questions, test });
  } catch (error) {
    console.error('Test questions fetch error:', error);
    res.status(500).json({ message: 'Error fetching test questions' });
  }
});

app.post('/api/tests/:testId/submit', authenticateToken, (req, res) => {
  try {
    const { testId } = req.params;
    const { score, correctCount, incorrectCount, unattemptedCount, timeTaken, answers } = req.body;
    const userId = req.user.id;

    const result = {
      id: db.testResults.length + 1,
      userId,
      testId: parseInt(testId),
      score,
      correctCount,
      incorrectCount,
      unattemptedCount,
      timeTaken,
      answers: answers || [],
      completedAt: new Date().toISOString()
    };
    
    db.testResults.push(result);
    saveDB(db);

    res.json({ success: true, resultId: result.id, result });
  } catch (error) {
    console.error('Test submit error:', error);
    res.status(500).json({ message: 'Error submitting test' });
  }
});

app.get('/api/tests/:testId/results', authenticateToken, (req, res) => {
  try {
    const { testId } = req.params;
    const userId = req.user.id;
    
    const results = db.testResults.filter(r => r.testId === parseInt(testId) && r.userId === userId);
    
    res.json({ results });
  } catch (error) {
    console.error('Test results fetch error:', error);
    res.status(500).json({ message: 'Error fetching test results' });
  }
});

// Analytics Routes
app.get('/api/analytics', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;
    const userAttempts = db.userAttempts.filter(a => a.userId === userId);
    const userTestResults = db.testResults.filter(r => r.userId === userId);

    // Subject-wise performance
    const subjectMap = {};
    userAttempts.forEach(attempt => {
      const question = db.questions.find(q => q.id === attempt.questionId);
      if (question) {
        if (!subjectMap[question.subject]) {
          subjectMap[question.subject] = { total: 0, correct: 0 };
        }
        subjectMap[question.subject].total++;
        if (attempt.isCorrect) subjectMap[question.subject].correct++;
      }
    });

    const subjectPerformance = Object.entries(subjectMap).map(([subject, data]) => ({
      subject: formatSubjectName(subject),
      score: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
      questions: data.total
    }));

    // Test history
    const testHistory = userTestResults.map(result => {
      const test = db.tests.find(t => t.id === result.testId);
      return {
        ...result,
        testTitle: test ? test.title : 'Unknown Test'
      };
    });

    res.json({
      subjectPerformance,
      testHistory,
      totalQuestions: userAttempts.length,
      correctAnswers: userAttempts.filter(a => a.isCorrect).length,
      testsCompleted: userTestResults.length,
      weeklyProgress: [
        { week: 'Week 1', questions: 150, accuracy: 62 },
        { week: 'Week 2', questions: 180, accuracy: 65 },
        { week: 'Week 3', questions: 200, accuracy: 68 },
        { week: 'Week 4', questions: 220, accuracy: 70 },
        { week: 'Week 5', questions: 250, accuracy: 72 },
        { week: 'Week 6', questions: 280, accuracy: 75 },
      ]
    });
  } catch (error) {
    console.error('Analytics fetch error:', error);
    res.status(500).json({ message: 'Error fetching analytics' });
  }
});

function formatSubjectName(subject) {
  const names = {
    'data-structures': 'Data Structures',
    'algorithms': 'Algorithms',
    'dbms': 'DBMS',
    'operating-systems': 'Operating Systems',
    'computer-networks': 'Computer Networks',
    'toc': 'Theory of Computation',
    'compiler-design': 'Compiler Design',
    'digital-logic': 'Digital Logic',
    'computer-organization': 'Computer Organization'
  };
  return names[subject] || subject;
}

// Bookmarks Routes
app.get('/api/bookmarks', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;
    const userBookmarks = db.bookmarks.filter(b => b.userId === userId);
    const questions = userBookmarks
      .map(b => db.questions.find(q => q.id === b.questionId))
      .filter(Boolean);
    res.json({ bookmarks: questions, total: questions.length });
  } catch (error) {
    console.error('Bookmarks fetch error:', error);
    res.status(500).json({ message: 'Error fetching bookmarks' });
  }
});

app.post('/api/bookmarks/:questionId', authenticateToken, (req, res) => {
  try {
    const { questionId } = req.params;
    const userId = req.user.id;

    const exists = db.bookmarks.find(b => b.userId === userId && b.questionId === parseInt(questionId));
    if (!exists) {
      db.bookmarks.push({
        id: db.bookmarks.length + 1,
        userId,
        questionId: parseInt(questionId),
        createdAt: new Date().toISOString()
      });
      saveDB(db);
    }

    res.json({ success: true, bookmarked: true });
  } catch (error) {
    console.error('Bookmark add error:', error);
    res.status(500).json({ message: 'Error adding bookmark' });
  }
});

app.delete('/api/bookmarks/:questionId', authenticateToken, (req, res) => {
  try {
    const { questionId } = req.params;
    const userId = req.user.id;

    const index = db.bookmarks.findIndex(b => b.userId === userId && b.questionId === parseInt(questionId));
    if (index > -1) {
      db.bookmarks.splice(index, 1);
      saveDB(db);
    }

    res.json({ success: true, bookmarked: false });
  } catch (error) {
    console.error('Bookmark delete error:', error);
    res.status(500).json({ message: 'Error removing bookmark' });
  }
});

// Notes Routes (for Revision Notes)
app.get('/api/notes', authenticateToken, (req, res) => {
  try {
    const notes = {
      'data-structures': [
        { id: 1, title: 'Arrays & Linked Lists', content: 'Comprehensive notes on array operations, linked list types and implementations...' },
        { id: 2, title: 'Trees & Binary Trees', content: 'BST, AVL, Red-Black trees, tree traversals...' },
        { id: 3, title: 'Graphs', content: 'BFS, DFS, shortest path algorithms, MST...' },
        { id: 4, title: 'Hashing', content: 'Hash functions, collision resolution, load factor...' },
      ],
      'algorithms': [
        { id: 5, title: 'Sorting Algorithms', content: 'Quick sort, merge sort, heap sort analysis...' },
        { id: 6, title: 'Dynamic Programming', content: 'DP principles, memoization, tabulation...' },
        { id: 7, title: 'Greedy Algorithms', content: 'Greedy choice property, optimal substructure...' },
      ],
      'dbms': [
        { id: 8, title: 'Normalization', content: '1NF, 2NF, 3NF, BCNF, 4NF, 5NF...' },
        { id: 9, title: 'SQL Queries', content: 'SELECT, JOIN, subqueries, aggregations...' },
        { id: 10, title: 'Transactions', content: 'ACID properties, serializability, locking...' },
      ],
      'operating-systems': [
        { id: 11, title: 'Process Management', content: 'PCB, scheduling algorithms, context switching...' },
        { id: 12, title: 'Memory Management', content: 'Paging, segmentation, virtual memory...' },
        { id: 13, title: 'Deadlocks', content: 'Conditions, prevention, avoidance, detection...' },
      ],
    };
    res.json({ notes });
  } catch (error) {
    console.error('Notes fetch error:', error);
    res.status(500).json({ message: 'Error fetching notes' });
  }
});

// Syllabus Routes
app.get('/api/syllabus', authenticateToken, (req, res) => {
  try {
    const syllabus = {
      'data-structures': {
        name: 'Data Structures',
        weightage: '12-15%',
        topics: [
          { name: 'Arrays and Linked Lists', importance: 'High', progress: 0 },
          { name: 'Stacks and Queues', importance: 'High', progress: 0 },
          { name: 'Trees and BST', importance: 'Very High', progress: 0 },
          { name: 'Graphs', importance: 'Very High', progress: 0 },
          { name: 'Hashing', importance: 'Medium', progress: 0 },
          { name: 'Heaps', importance: 'High', progress: 0 },
        ]
      },
      'algorithms': {
        name: 'Algorithms',
        weightage: '10-12%',
        topics: [
          { name: 'Asymptotic Analysis', importance: 'Very High', progress: 0 },
          { name: 'Sorting and Searching', importance: 'High', progress: 0 },
          { name: 'Divide and Conquer', importance: 'High', progress: 0 },
          { name: 'Dynamic Programming', importance: 'Very High', progress: 0 },
          { name: 'Greedy Algorithms', importance: 'High', progress: 0 },
          { name: 'Graph Algorithms', importance: 'Very High', progress: 0 },
        ]
      },
      'dbms': {
        name: 'Database Management Systems',
        weightage: '8-10%',
        topics: [
          { name: 'ER Model', importance: 'Medium', progress: 0 },
          { name: 'Relational Model', importance: 'High', progress: 0 },
          { name: 'SQL', importance: 'Very High', progress: 0 },
          { name: 'Normalization', importance: 'Very High', progress: 0 },
          { name: 'Transactions', importance: 'High', progress: 0 },
          { name: 'Indexing', importance: 'Medium', progress: 0 },
        ]
      },
      'operating-systems': {
        name: 'Operating Systems',
        weightage: '10-12%',
        topics: [
          { name: 'Process Management', importance: 'Very High', progress: 0 },
          { name: 'CPU Scheduling', importance: 'Very High', progress: 0 },
          { name: 'Synchronization', importance: 'High', progress: 0 },
          { name: 'Deadlocks', importance: 'High', progress: 0 },
          { name: 'Memory Management', importance: 'Very High', progress: 0 },
          { name: 'File Systems', importance: 'Medium', progress: 0 },
        ]
      },
      'computer-networks': {
        name: 'Computer Networks',
        weightage: '8-10%',
        topics: [
          { name: 'OSI & TCP/IP Models', importance: 'High', progress: 0 },
          { name: 'Data Link Layer', importance: 'Medium', progress: 0 },
          { name: 'Network Layer', importance: 'Very High', progress: 0 },
          { name: 'Transport Layer', importance: 'Very High', progress: 0 },
          { name: 'Application Layer', importance: 'Medium', progress: 0 },
        ]
      },
      'toc': {
        name: 'Theory of Computation',
        weightage: '8-10%',
        topics: [
          { name: 'Finite Automata', importance: 'Very High', progress: 0 },
          { name: 'Regular Languages', importance: 'High', progress: 0 },
          { name: 'Context-Free Languages', importance: 'Very High', progress: 0 },
          { name: 'Pushdown Automata', importance: 'High', progress: 0 },
          { name: 'Turing Machines', importance: 'High', progress: 0 },
          { name: 'Decidability', importance: 'Medium', progress: 0 },
        ]
      },
    };
    res.json({ syllabus });
  } catch (error) {
    console.error('Syllabus fetch error:', error);
    res.status(500).json({ message: 'Error fetching syllabus' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ==================== ADMIN ROUTES ====================

// Admin Login
app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = db.admins.find(a => a.email === email);
    if (!admin) {
      return res.status(400).json({ message: 'Invalid admin credentials' });
    }

    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid admin credentials' });
    }

    const adminData = { id: admin.id, name: admin.name, email: admin.email, role: admin.role, isAdmin: true };
    const token = jwt.sign(adminData, JWT_SECRET, { expiresIn: '24h' });

    res.json({ admin: adminData, token });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error during admin login' });
  }
});

// Admin - Get Dashboard Stats
app.get('/api/admin/stats', authenticateAdmin, (req, res) => {
  try {
    res.json({
      totalQuestions: db.questions.length,
      totalTests: db.tests.length,
      totalUsers: db.users.length,
      totalAttempts: db.userAttempts.length,
      subjectBreakdown: getSubjectBreakdown(),
      recentActivity: getRecentActivity()
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ message: 'Error fetching admin stats' });
  }
});

function getSubjectBreakdown() {
  const breakdown = {};
  db.questions.forEach(q => {
    breakdown[q.subject] = (breakdown[q.subject] || 0) + 1;
  });
  return Object.entries(breakdown).map(([subject, count]) => ({
    subject: formatSubjectName(subject),
    count
  }));
}

function getRecentActivity() {
  return db.userAttempts
    .slice(-10)
    .reverse()
    .map(a => ({
      type: 'attempt',
      userId: a.userId,
      questionId: a.questionId,
      date: a.attemptDate
    }));
}

// Admin - Get All Questions (with pagination & filters)
app.get('/api/admin/questions', authenticateAdmin, (req, res) => {
  try {
    const { page = 1, limit = 20, subject, topic, difficulty, search } = req.query;
    let questions = [...db.questions];

    // Apply filters
    if (subject) {
      questions = questions.filter(q => q.subject === subject);
    }
    if (topic) {
      questions = questions.filter(q => q.topic === topic);
    }
    if (difficulty) {
      questions = questions.filter(q => q.difficulty.toLowerCase() === difficulty.toLowerCase());
    }
    if (search) {
      const searchLower = search.toLowerCase();
      questions = questions.filter(q => 
        q.question.toLowerCase().includes(searchLower) ||
        q.explanation?.toLowerCase().includes(searchLower)
      );
    }

    const total = questions.length;
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const paginatedQuestions = questions.slice(startIndex, startIndex + parseInt(limit));

    res.json({
      questions: paginatedQuestions,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    console.error('Admin questions fetch error:', error);
    res.status(500).json({ message: 'Error fetching questions' });
  }
});

// Admin - Get Single Question
app.get('/api/admin/questions/:id', authenticateAdmin, (req, res) => {
  try {
    const question = db.questions.find(q => q.id === parseInt(req.params.id));
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.json({ question });
  } catch (error) {
    console.error('Admin question fetch error:', error);
    res.status(500).json({ message: 'Error fetching question' });
  }
});

// Admin - Create Question
app.post('/api/admin/questions', authenticateAdmin, (req, res) => {
  try {
    const { subject, topic, question, options, correctAnswer, explanation, difficulty, year, marks, negativeMarks } = req.body;

    // Validation
    if (!subject || !topic || !question || !options || correctAnswer === undefined) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (!Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ message: 'Options must be an array with at least 2 items' });
    }

    const newQuestion = {
      id: Math.max(...db.questions.map(q => q.id), 0) + 1,
      subject,
      topic,
      question,
      options,
      correctAnswer: parseInt(correctAnswer),
      explanation: explanation || '',
      difficulty: difficulty || 'Medium',
      year: year || null,
      marks: marks || 1,
      negativeMarks: negativeMarks || 0.33,
      createdAt: new Date().toISOString(),
      createdBy: req.admin.id
    };

    db.questions.push(newQuestion);
    saveDB(db);

    res.status(201).json({ message: 'Question created successfully', question: newQuestion });
  } catch (error) {
    console.error('Admin question create error:', error);
    res.status(500).json({ message: 'Error creating question' });
  }
});

// Admin - Update Question
app.put('/api/admin/questions/:id', authenticateAdmin, (req, res) => {
  try {
    const questionId = parseInt(req.params.id);
    const questionIndex = db.questions.findIndex(q => q.id === questionId);

    if (questionIndex === -1) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const { subject, topic, question, options, correctAnswer, explanation, difficulty, year, marks, negativeMarks } = req.body;

    // Update fields
    if (subject) db.questions[questionIndex].subject = subject;
    if (topic) db.questions[questionIndex].topic = topic;
    if (question) db.questions[questionIndex].question = question;
    if (options) db.questions[questionIndex].options = options;
    if (correctAnswer !== undefined) db.questions[questionIndex].correctAnswer = parseInt(correctAnswer);
    if (explanation !== undefined) db.questions[questionIndex].explanation = explanation;
    if (difficulty) db.questions[questionIndex].difficulty = difficulty;
    if (year !== undefined) db.questions[questionIndex].year = year;
    if (marks !== undefined) db.questions[questionIndex].marks = marks;
    if (negativeMarks !== undefined) db.questions[questionIndex].negativeMarks = negativeMarks;
    
    db.questions[questionIndex].updatedAt = new Date().toISOString();
    db.questions[questionIndex].updatedBy = req.admin.id;

    saveDB(db);

    res.json({ message: 'Question updated successfully', question: db.questions[questionIndex] });
  } catch (error) {
    console.error('Admin question update error:', error);
    res.status(500).json({ message: 'Error updating question' });
  }
});

// Admin - Delete Question
app.delete('/api/admin/questions/:id', authenticateAdmin, (req, res) => {
  try {
    const questionId = parseInt(req.params.id);
    const questionIndex = db.questions.findIndex(q => q.id === questionId);

    if (questionIndex === -1) {
      return res.status(404).json({ message: 'Question not found' });
    }

    db.questions.splice(questionIndex, 1);
    saveDB(db);

    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error('Admin question delete error:', error);
    res.status(500).json({ message: 'Error deleting question' });
  }
});

// Admin - Bulk Import Questions
app.post('/api/admin/questions/bulk', authenticateAdmin, (req, res) => {
  try {
    const { questions } = req.body;

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: 'Questions array is required' });
    }

    const maxId = Math.max(...db.questions.map(q => q.id), 0);
    const newQuestions = questions.map((q, index) => ({
      id: maxId + index + 1,
      subject: q.subject,
      topic: q.topic,
      question: q.question,
      options: q.options,
      correctAnswer: parseInt(q.correctAnswer),
      explanation: q.explanation || '',
      difficulty: q.difficulty || 'Medium',
      year: q.year || null,
      marks: q.marks || 1,
      negativeMarks: q.negativeMarks || 0.33,
      createdAt: new Date().toISOString(),
      createdBy: req.admin.id
    }));

    db.questions.push(...newQuestions);
    saveDB(db);

    res.status(201).json({ message: `${newQuestions.length} questions imported successfully`, count: newQuestions.length });
  } catch (error) {
    console.error('Admin bulk import error:', error);
    res.status(500).json({ message: 'Error importing questions' });
  }
});

// Admin - Get All Tests
app.get('/api/admin/tests', authenticateAdmin, (req, res) => {
  try {
    res.json({ tests: db.tests });
  } catch (error) {
    console.error('Admin tests fetch error:', error);
    res.status(500).json({ message: 'Error fetching tests' });
  }
});

// Admin - Create Test
app.post('/api/admin/tests', authenticateAdmin, (req, res) => {
  try {
    const { title, description, duration, totalQuestions, totalMarks, difficulty, type } = req.body;

    const newTest = {
      id: Math.max(...db.tests.map(t => t.id), 0) + 1,
      title,
      description,
      duration: parseInt(duration),
      totalQuestions: parseInt(totalQuestions),
      totalMarks: parseInt(totalMarks),
      difficulty: difficulty || 'Medium',
      type: type || 'full',
      isActive: true,
      createdAt: new Date().toISOString()
    };

    db.tests.push(newTest);
    saveDB(db);

    res.status(201).json({ message: 'Test created successfully', test: newTest });
  } catch (error) {
    console.error('Admin test create error:', error);
    res.status(500).json({ message: 'Error creating test' });
  }
});

// Admin - Update Test
app.put('/api/admin/tests/:id', authenticateAdmin, (req, res) => {
  try {
    const testId = parseInt(req.params.id);
    const testIndex = db.tests.findIndex(t => t.id === testId);

    if (testIndex === -1) {
      return res.status(404).json({ message: 'Test not found' });
    }

    const { title, description, duration, totalQuestions, totalMarks, difficulty, type, isActive } = req.body;

    if (title) db.tests[testIndex].title = title;
    if (description) db.tests[testIndex].description = description;
    if (duration) db.tests[testIndex].duration = parseInt(duration);
    if (totalQuestions) db.tests[testIndex].totalQuestions = parseInt(totalQuestions);
    if (totalMarks) db.tests[testIndex].totalMarks = parseInt(totalMarks);
    if (difficulty) db.tests[testIndex].difficulty = difficulty;
    if (type) db.tests[testIndex].type = type;
    if (isActive !== undefined) db.tests[testIndex].isActive = isActive;

    saveDB(db);

    res.json({ message: 'Test updated successfully', test: db.tests[testIndex] });
  } catch (error) {
    console.error('Admin test update error:', error);
    res.status(500).json({ message: 'Error updating test' });
  }
});

// Admin - Delete Test
app.delete('/api/admin/tests/:id', authenticateAdmin, (req, res) => {
  try {
    const testId = parseInt(req.params.id);
    const testIndex = db.tests.findIndex(t => t.id === testId);

    if (testIndex === -1) {
      return res.status(404).json({ message: 'Test not found' });
    }

    db.tests.splice(testIndex, 1);
    saveDB(db);

    res.json({ message: 'Test deleted successfully' });
  } catch (error) {
    console.error('Admin test delete error:', error);
    res.status(500).json({ message: 'Error deleting test' });
  }
});

// Admin - Get All Users
app.get('/api/admin/users', authenticateAdmin, (req, res) => {
  try {
    const users = db.users.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      branch: u.branch,
      createdAt: u.createdAt,
      attempts: db.userAttempts.filter(a => a.userId === u.id).length,
      testsCompleted: db.testResults.filter(r => r.userId === u.id).length
    }));
    res.json({ users });
  } catch (error) {
    console.error('Admin users fetch error:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Admin - Get Subject/Topic Options
app.get('/api/admin/options', authenticateAdmin, (req, res) => {
  try {
    const subjects = [
      { value: 'data-structures', label: 'Data Structures' },
      { value: 'algorithms', label: 'Algorithms' },
      { value: 'dbms', label: 'DBMS' },
      { value: 'operating-systems', label: 'Operating Systems' },
      { value: 'computer-networks', label: 'Computer Networks' },
      { value: 'toc', label: 'Theory of Computation' },
      { value: 'compiler-design', label: 'Compiler Design' },
      { value: 'digital-logic', label: 'Digital Logic' },
      { value: 'computer-organization', label: 'Computer Organization' }
    ];

    const topics = {
      'data-structures': [
        { value: 'arrays-linked-lists', label: 'Arrays & Linked Lists' },
        { value: 'stacks-queues', label: 'Stacks & Queues' },
        { value: 'trees', label: 'Trees' },
        { value: 'graphs', label: 'Graphs' },
        { value: 'hashing', label: 'Hashing' },
        { value: 'heaps', label: 'Heaps' },
        { value: 'sorting-searching', label: 'Sorting & Searching' }
      ],
      'algorithms': [
        { value: 'complexity-analysis', label: 'Complexity Analysis' },
        { value: 'divide-conquer', label: 'Divide and Conquer' },
        { value: 'dynamic-programming', label: 'Dynamic Programming' },
        { value: 'greedy-algorithms', label: 'Greedy Algorithms' },
        { value: 'backtracking', label: 'Backtracking' }
      ],
      'dbms': [
        { value: 'er-model', label: 'ER Model' },
        { value: 'relational-model', label: 'Relational Model' },
        { value: 'sql', label: 'SQL' },
        { value: 'normalization', label: 'Normalization' },
        { value: 'transactions', label: 'Transactions' },
        { value: 'indexing', label: 'Indexing' }
      ],
      'operating-systems': [
        { value: 'process-management', label: 'Process Management' },
        { value: 'cpu-scheduling', label: 'CPU Scheduling' },
        { value: 'synchronization', label: 'Synchronization' },
        { value: 'deadlocks', label: 'Deadlocks' },
        { value: 'memory-management', label: 'Memory Management' },
        { value: 'file-systems', label: 'File Systems' }
      ],
      'computer-networks': [
        { value: 'osi-tcp', label: 'OSI & TCP/IP Models' },
        { value: 'data-link-layer', label: 'Data Link Layer' },
        { value: 'network-layer', label: 'Network Layer' },
        { value: 'transport-layer', label: 'Transport Layer' },
        { value: 'application-layer', label: 'Application Layer' }
      ],
      'toc': [
        { value: 'finite-automata', label: 'Finite Automata' },
        { value: 'regular-languages', label: 'Regular Languages' },
        { value: 'cfg-pda', label: 'CFG & PDA' },
        { value: 'turing-machines', label: 'Turing Machines' },
        { value: 'decidability', label: 'Decidability' }
      ],
      'compiler-design': [
        { value: 'lexical-analysis', label: 'Lexical Analysis' },
        { value: 'parsing', label: 'Parsing' },
        { value: 'syntax-directed', label: 'Syntax Directed Translation' },
        { value: 'code-optimization', label: 'Code Optimization' }
      ],
      'digital-logic': [
        { value: 'boolean-algebra', label: 'Boolean Algebra' },
        { value: 'combinational-circuits', label: 'Combinational Circuits' },
        { value: 'sequential-circuits', label: 'Sequential Circuits' }
      ],
      'computer-organization': [
        { value: 'cpu-architecture', label: 'CPU Architecture' },
        { value: 'memory-hierarchy', label: 'Memory Hierarchy' },
        { value: 'io-systems', label: 'I/O Systems' },
        { value: 'pipelining', label: 'Pipelining' }
      ]
    };

    const difficulties = ['Easy', 'Medium', 'Hard'];
    const years = ['GATE 2017', 'GATE 2018', 'GATE 2019', 'GATE 2020', 'GATE 2021', 'GATE 2022', 'GATE 2023', 'GATE 2024', 'GATE 2025'];

    res.json({ subjects, topics, difficulties, years });
  } catch (error) {
    console.error('Admin options fetch error:', error);
    res.status(500).json({ message: 'Error fetching options' });
  }
});

// Admin - Get PYQ Papers Summary
app.get('/api/admin/pyqs', authenticateAdmin, (req, res) => {
  try {
    // Get all questions that have a year set
    const pyqQuestions = db.questions.filter(q => q.year !== null && q.year !== '');
    
    // Group by year and subject
    const paperMap = {};
    pyqQuestions.forEach(q => {
      const key = `${q.year}-${q.subject || 'all'}`;
      if (!paperMap[key]) {
        paperMap[key] = {
          year: q.year,
          subject: q.subject,
          questionCount: 0,
          topics: new Set()
        };
      }
      paperMap[key].questionCount++;
      paperMap[key].topics.add(q.topic);
    });

    const papers = Object.values(paperMap).map(p => ({
      ...p,
      topicCount: p.topics.size,
      topics: undefined
    })).sort((a, b) => b.year.localeCompare(a.year));

    const uniqueYears = new Set(pyqQuestions.map(q => q.year));

    res.json({
      papers,
      totalPapers: papers.length,
      totalQuestions: pyqQuestions.length,
      yearsCovered: uniqueYears.size
    });
  } catch (error) {
    console.error('Admin PYQs fetch error:', error);
    res.status(500).json({ message: 'Error fetching PYQ papers' });
  }
});

// ==================== USER ANALYTICS API ====================

// Get user's analytics data
app.get('/api/analytics', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;

    const userAttempts = db.userAttempts.filter(a => a.userId === userId);
    const userTestResults = db.testResults.filter(r => r.userId === userId);

    // Check if user has any activity
    const hasActivity = userAttempts.length > 0 || userTestResults.length > 0;

    if (!hasActivity) {
      return res.json({
        hasData: false,
        message: 'No activity yet'
      });
    }

    // Calculate subject-wise performance
    const subjectStats = {};
    userAttempts.forEach(a => {
      const question = db.questions.find(q => q.id === a.questionId);
      if (question) {
        if (!subjectStats[question.subject]) {
          subjectStats[question.subject] = { total: 0, correct: 0 };
        }
        subjectStats[question.subject].total++;
        if (a.isCorrect) {
          subjectStats[question.subject].correct++;
        }
      }
    });

    const subjectPerformance = Object.entries(subjectStats).map(([subject, stats]) => ({
      subject: formatSubjectName(subject),
      subjectId: subject,
      score: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
      questions: stats.total,
      correct: stats.correct
    }));

    // Calculate weekly progress
    const weeklyProgress = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - (i * 7 + 7));
      const weekEnd = new Date(now);
      weekEnd.setDate(weekEnd.getDate() - (i * 7));

      const weekAttempts = userAttempts.filter(a => {
        const attemptDate = new Date(a.attemptDate || a.createdAt);
        return attemptDate >= weekStart && attemptDate < weekEnd;
      });

      const weekTests = userTestResults.filter(r => {
        const testDate = new Date(r.completedAt);
        return testDate >= weekStart && testDate < weekEnd;
      });

      const correctInWeek = weekAttempts.filter(a => a.isCorrect).length;

      weeklyProgress.push({
        week: `Week ${6 - i}`,
        questions: weekAttempts.length,
        accuracy: weekAttempts.length > 0 ? Math.round((correctInWeek / weekAttempts.length) * 100) : 0,
        tests: weekTests.length
      });
    }

    // Calculate difficulty breakdown
    const difficultyStats = { Easy: 0, Medium: 0, Hard: 0 };
    userAttempts.forEach(a => {
      const question = db.questions.find(q => q.id === a.questionId);
      if (question && difficultyStats[question.difficulty] !== undefined) {
        difficultyStats[question.difficulty]++;
      }
    });

    const difficultyBreakdown = [
      { name: 'Easy', value: difficultyStats.Easy, color: '#10b981' },
      { name: 'Medium', value: difficultyStats.Medium, color: '#f59e0b' },
      { name: 'Hard', value: difficultyStats.Hard, color: '#ef4444' }
    ];

    // Identify weak areas (topics with < 60% accuracy and at least 5 attempts)
    const topicStats = {};
    userAttempts.forEach(a => {
      const question = db.questions.find(q => q.id === a.questionId);
      if (question) {
        const key = `${question.subject}-${question.topic}`;
        if (!topicStats[key]) {
          topicStats[key] = { subject: question.subject, topic: question.topic, total: 0, correct: 0 };
        }
        topicStats[key].total++;
        if (a.isCorrect) topicStats[key].correct++;
      }
    });

    const weakAreas = Object.values(topicStats)
      .filter(t => t.total >= 5 && (t.correct / t.total) < 0.6)
      .map(t => ({
        topic: `${formatSubjectName(t.subject)} - ${formatTopicName(t.topic)}`,
        accuracy: Math.round((t.correct / t.total) * 100),
        questionsAttempted: t.total
      }))
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 5);

    // Recent tests
    const recentTests = userTestResults
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
      .slice(0, 5)
      .map(r => {
        const test = db.tests.find(t => t.id === r.testId);
        return {
          id: r.testId,
          name: test?.title || 'Unknown Test',
          date: r.completedAt,
          score: Math.round(r.score),
          percentage: Math.round(r.percentage || r.score)
        };
      });

    // Overall stats
    const correctAttempts = userAttempts.filter(a => a.isCorrect).length;
    const overallAccuracy = userAttempts.length > 0 
      ? Math.round((correctAttempts / userAttempts.length) * 100) 
      : 0;

    res.json({
      hasData: true,
      subjectPerformance,
      weeklyProgress,
      difficultyBreakdown,
      weakAreas,
      recentTests,
      stats: {
        totalQuestions: userAttempts.length,
        correctAnswers: correctAttempts,
        overallAccuracy,
        testsCompleted: userTestResults.length,
        studyHours: Math.floor(userAttempts.length / 10),
        weakTopicsCount: weakAreas.length
      }
    });
  } catch (error) {
    console.error('Analytics fetch error:', error);
    res.status(500).json({ message: 'Error fetching analytics' });
  }
});

// Get PYQs for users
app.get('/api/pyqs', (req, res) => {
  try {
    // Generate PYQ years data from questions that have year info
    const yearsMap = {};
    const topicsMap = {};
    
    db.questions.forEach(q => {
      // Check if question has year info (PYQ)
      const year = q.year || q.pyqYear;
      if (year) {
        if (!yearsMap[year]) {
          yearsMap[year] = { year: parseInt(year), questions: 0, avgScore: 0 };
        }
        yearsMap[year].questions++;
      }
      
      // Topic mapping
      const topic = q.subject || q.topic;
      if (topic) {
        const formattedTopic = formatTopicName(topic);
        if (!topicsMap[formattedTopic]) {
          topicsMap[formattedTopic] = { topic: formattedTopic, count: 0, years: '' };
        }
        topicsMap[formattedTopic].count++;
      }
    });
    
    // If no year data, create sample years
    let years = Object.values(yearsMap).sort((a, b) => b.year - a.year);
    if (years.length === 0) {
      years = Array.from({ length: 12 }, (_, i) => ({
        year: 2025 - i,
        questions: 65,
        avgScore: 0
      }));
    }
    
    let topics = Object.values(topicsMap);
    if (topics.length === 0) {
      topics = [
        { topic: 'Data Structures', count: db.questions.filter(q => q.subject === 'data-structures').length || 15, years: '2014-2025' },
        { topic: 'Algorithms', count: db.questions.filter(q => q.subject === 'algorithms').length || 12, years: '2014-2025' },
        { topic: 'Operating Systems', count: db.questions.filter(q => q.subject === 'operating-systems').length || 10, years: '2014-2025' },
        { topic: 'DBMS', count: db.questions.filter(q => q.subject === 'dbms').length || 8, years: '2014-2025' },
        { topic: 'Computer Networks', count: db.questions.filter(q => q.subject === 'computer-networks').length || 7, years: '2014-2025' },
        { topic: 'Theory of Computation', count: db.questions.filter(q => q.subject === 'theory-of-computation').length || 6, years: '2014-2025' },
        { topic: 'Compiler Design', count: db.questions.filter(q => q.subject === 'compiler-design').length || 5, years: '2014-2025' },
        { topic: 'Digital Logic', count: db.questions.filter(q => q.subject === 'digital-logic').length || 4, years: '2014-2025' },
      ];
    }
    
    res.json({
      years,
      topics,
      stats: {
        totalYears: years.length,
        totalQuestions: db.questions.length,
        avgScore: 0
      }
    });
  } catch (error) {
    console.error('PYQs fetch error:', error);
    res.status(500).json({ message: 'Error fetching PYQs' });
  }
});

// Get user PYQ history
app.get('/api/user/pyq-history', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;
    // Get completed years from user's practice attempts
    const userAttempts = db.practiceAttempts?.filter(a => a.userId === userId && a.type === 'pyq') || [];
    const completedYears = [...new Set(userAttempts.map(a => a.year))];
    
    res.json({
      completedYears,
      attempts: userAttempts
    });
  } catch (error) {
    console.error('PYQ history fetch error:', error);
    res.status(500).json({ message: 'Error fetching PYQ history' });
  }
});

// Helper function to format topic names
function formatTopicName(topic) {
  return topic
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Start server
app.listen(PORT, () => {
  console.log(`
🎓 GATE Prep Pro Server
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 Server running on http://localhost:${PORT}
📚 ${db.questions.length} questions loaded
📝 ${db.tests.length} tests available

🔐 Demo credentials:
   Email: demo@gateprep.com
   Password: demo123
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `);
});
