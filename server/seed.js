import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, 'database.sqlite'));

console.log('🌱 Seeding database with sample data...\n');

// Sample questions data
const questions = [
  // Data Structures - Trees
  {
    subject: 'data-structures',
    topic: 'trees',
    question: 'What is the time complexity of searching for an element in a balanced Binary Search Tree?',
    options: JSON.stringify(['O(1)', 'O(log n)', 'O(n)', 'O(n log n)']),
    correct_answer: 1,
    explanation: 'In a balanced BST, the height is O(log n). Since search operation traverses from root to leaf in the worst case, the time complexity is O(log n).',
    difficulty: 'Easy',
    year: null,
    marks: 1,
    negative_marks: 0.33
  },
  {
    subject: 'data-structures',
    topic: 'trees',
    question: 'Which of the following is NOT a property of a Binary Search Tree?',
    options: JSON.stringify([
      'Left subtree contains only nodes with keys less than the node\'s key',
      'Right subtree contains only nodes with keys greater than the node\'s key',
      'Both left and right subtrees must also be binary search trees',
      'The tree must be complete'
    ]),
    correct_answer: 3,
    explanation: 'A BST does not need to be complete. A complete binary tree is one where all levels except possibly the last are completely filled.',
    difficulty: 'Medium',
    year: null,
    marks: 1,
    negative_marks: 0.33
  },
  {
    subject: 'data-structures',
    topic: 'trees',
    question: 'The worst-case time complexity of inserting n elements into an initially empty Binary Search Tree is:',
    options: JSON.stringify(['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)']),
    correct_answer: 2,
    explanation: 'If elements are inserted in sorted order, the BST degenerates into a linked list. Each insertion takes O(n) time, so n insertions take O(n²) time.',
    difficulty: 'Medium',
    year: 'GATE 2019',
    marks: 2,
    negative_marks: 0.66
  },
  {
    subject: 'data-structures',
    topic: 'trees',
    question: 'What is the minimum number of nodes in an AVL tree of height 3?',
    options: JSON.stringify(['5', '7', '9', '12']),
    correct_answer: 1,
    explanation: 'The minimum number of nodes in an AVL tree follows N(h) = N(h-1) + N(h-2) + 1. For h=3: N(3) = N(2) + N(1) + 1 = 4 + 2 + 1 = 7.',
    difficulty: 'Hard',
    year: 'GATE 2018',
    marks: 2,
    negative_marks: 0.66
  },
  {
    subject: 'data-structures',
    topic: 'trees',
    question: 'In a complete binary tree with n nodes, what is the maximum height?',
    options: JSON.stringify(['log₂(n)', '⌊log₂(n)⌋', '⌈log₂(n+1)⌉ - 1', 'n-1']),
    correct_answer: 2,
    explanation: 'In a complete binary tree, the height is ⌈log₂(n+1)⌉ - 1 or equivalently ⌊log₂(n)⌋.',
    difficulty: 'Medium',
    year: null,
    marks: 1,
    negative_marks: 0.33
  },
  // Data Structures - Arrays
  {
    subject: 'data-structures',
    topic: 'arrays-linked-lists',
    question: 'What is the time complexity of inserting an element at the beginning of an array?',
    options: JSON.stringify(['O(1)', 'O(log n)', 'O(n)', 'O(n²)']),
    correct_answer: 2,
    explanation: 'To insert at the beginning, all existing elements must be shifted right, which takes O(n) time.',
    difficulty: 'Easy',
    year: null,
    marks: 1,
    negative_marks: 0.33
  },
  {
    subject: 'data-structures',
    topic: 'arrays-linked-lists',
    question: 'Which operation has O(1) time complexity in a doubly linked list if we have a pointer to the node?',
    options: JSON.stringify(['Search', 'Deletion', 'Finding middle element', 'Sorting']),
    correct_answer: 1,
    explanation: 'In a doubly linked list, if we have a pointer to the node, deletion takes O(1) as we can directly update prev and next pointers.',
    difficulty: 'Easy',
    year: 'GATE 2020',
    marks: 1,
    negative_marks: 0.33
  },
  // Algorithms
  {
    subject: 'data-structures',
    topic: 'sorting-searching',
    question: 'Which sorting algorithm has the best average case time complexity?',
    options: JSON.stringify(['Bubble Sort O(n²)', 'Merge Sort O(n log n)', 'Insertion Sort O(n²)', 'Selection Sort O(n²)']),
    correct_answer: 1,
    explanation: 'Merge Sort has O(n log n) average case time complexity which is better than O(n²) of other options.',
    difficulty: 'Easy',
    year: null,
    marks: 1,
    negative_marks: 0.33
  },
  {
    subject: 'data-structures',
    topic: 'sorting-searching',
    question: 'What is the recurrence relation for Merge Sort?',
    options: JSON.stringify(['T(n) = T(n-1) + O(n)', 'T(n) = 2T(n/2) + O(n)', 'T(n) = T(n/2) + O(1)', 'T(n) = 2T(n-1) + O(1)']),
    correct_answer: 1,
    explanation: 'Merge Sort divides the array into two halves (2T(n/2)) and then merges them (O(n)).',
    difficulty: 'Medium',
    year: 'GATE 2017',
    marks: 1,
    negative_marks: 0.33
  },
  {
    subject: 'data-structures',
    topic: 'graphs',
    question: 'What is the time complexity of BFS traversal of a graph with V vertices and E edges?',
    options: JSON.stringify(['O(V)', 'O(E)', 'O(V + E)', 'O(V × E)']),
    correct_answer: 2,
    explanation: 'BFS visits each vertex once and each edge once (in undirected graph, twice for directed), giving O(V + E).',
    difficulty: 'Medium',
    year: null,
    marks: 1,
    negative_marks: 0.33
  },
  // DBMS
  {
    subject: 'dbms',
    topic: 'normalization',
    question: 'Which normal form deals with multivalued dependencies?',
    options: JSON.stringify(['2NF', '3NF', 'BCNF', '4NF']),
    correct_answer: 3,
    explanation: '4NF (Fourth Normal Form) specifically deals with multivalued dependencies.',
    difficulty: 'Medium',
    year: 'GATE 2019',
    marks: 1,
    negative_marks: 0.33
  },
  {
    subject: 'dbms',
    topic: 'sql',
    question: 'Which SQL clause is used to filter groups?',
    options: JSON.stringify(['WHERE', 'HAVING', 'GROUP BY', 'ORDER BY']),
    correct_answer: 1,
    explanation: 'HAVING clause is used to filter groups after GROUP BY, while WHERE filters rows before grouping.',
    difficulty: 'Easy',
    year: null,
    marks: 1,
    negative_marks: 0.33
  },
  {
    subject: 'dbms',
    topic: 'transactions',
    question: 'Which property of ACID ensures that a transaction is treated as a single unit?',
    options: JSON.stringify(['Atomicity', 'Consistency', 'Isolation', 'Durability']),
    correct_answer: 0,
    explanation: 'Atomicity ensures that either all operations of a transaction are completed or none are.',
    difficulty: 'Easy',
    year: 'GATE 2021',
    marks: 1,
    negative_marks: 0.33
  },
  // Operating Systems
  {
    subject: 'operating-systems',
    topic: 'process-management',
    question: 'Which scheduling algorithm can cause starvation?',
    options: JSON.stringify(['Round Robin', 'FCFS', 'SJF', 'All of the above']),
    correct_answer: 2,
    explanation: 'Shortest Job First (SJF) can cause starvation for longer processes if shorter ones keep arriving.',
    difficulty: 'Medium',
    year: null,
    marks: 1,
    negative_marks: 0.33
  },
  {
    subject: 'operating-systems',
    topic: 'memory-management',
    question: 'In virtual memory, thrashing occurs when:',
    options: JSON.stringify([
      'CPU utilization is very high',
      'The system spends more time paging than executing',
      'Multiple processes are in deadlock',
      'Memory fragmentation is high'
    ]),
    correct_answer: 1,
    explanation: 'Thrashing occurs when the system is constantly swapping pages in and out, spending more time on paging than actual execution.',
    difficulty: 'Medium',
    year: 'GATE 2018',
    marks: 2,
    negative_marks: 0.66
  },
  {
    subject: 'operating-systems',
    topic: 'deadlocks',
    question: 'The Banker\'s algorithm is used for:',
    options: JSON.stringify(['Deadlock detection', 'Deadlock avoidance', 'Deadlock prevention', 'Deadlock recovery']),
    correct_answer: 1,
    explanation: 'Banker\'s algorithm is a deadlock avoidance algorithm that checks if granting a resource request would leave the system in a safe state.',
    difficulty: 'Easy',
    year: 'GATE 2020',
    marks: 1,
    negative_marks: 0.33
  },
  // Computer Networks
  {
    subject: 'computer-networks',
    topic: 'osi-tcp',
    question: 'In TCP/IP, the protocol responsible for routing packets is:',
    options: JSON.stringify(['TCP', 'UDP', 'IP', 'ICMP']),
    correct_answer: 2,
    explanation: 'IP (Internet Protocol) is responsible for routing packets from source to destination across networks.',
    difficulty: 'Easy',
    year: null,
    marks: 1,
    negative_marks: 0.33
  },
  {
    subject: 'computer-networks',
    topic: 'transport-layer',
    question: 'Which protocol provides reliable data transfer?',
    options: JSON.stringify(['UDP', 'IP', 'TCP', 'ICMP']),
    correct_answer: 2,
    explanation: 'TCP (Transmission Control Protocol) provides reliable, ordered, and error-checked delivery of data.',
    difficulty: 'Easy',
    year: 'GATE 2019',
    marks: 1,
    negative_marks: 0.33
  },
  // Theory of Computation
  {
    subject: 'toc',
    topic: 'finite-automata',
    question: 'Which of the following is true about DFA and NFA?',
    options: JSON.stringify([
      'DFA is more powerful than NFA',
      'NFA is more powerful than DFA',
      'DFA and NFA are equivalent in power',
      'DFA cannot be converted to NFA'
    ]),
    correct_answer: 2,
    explanation: 'DFA and NFA are equivalent in power - any language accepted by an NFA can also be accepted by some DFA.',
    difficulty: 'Medium',
    year: 'GATE 2017',
    marks: 1,
    negative_marks: 0.33
  },
  {
    subject: 'toc',
    topic: 'cfg-pda',
    question: 'Context-free languages are closed under:',
    options: JSON.stringify(['Union', 'Intersection', 'Complementation', 'All of the above']),
    correct_answer: 0,
    explanation: 'CFLs are closed under union but NOT under intersection or complementation.',
    difficulty: 'Hard',
    year: 'GATE 2018',
    marks: 2,
    negative_marks: 0.66
  },
];

// Sample tests
const tests = [
  {
    title: 'GATE CS Mock Test #1',
    description: 'Full-length practice test covering complete GATE CS syllabus',
    duration: 180,
    total_questions: 65,
    total_marks: 100,
    difficulty: 'Medium',
    type: 'full'
  },
  {
    title: 'Data Structures Mini Test',
    description: 'Quick assessment of DS concepts - Arrays, Trees, Graphs',
    duration: 45,
    total_questions: 20,
    total_marks: 30,
    difficulty: 'Easy',
    type: 'mini'
  },
  {
    title: 'DBMS Sectional Test',
    description: 'Complete DBMS section covering SQL, Normalization, Transactions',
    duration: 60,
    total_questions: 25,
    total_marks: 40,
    difficulty: 'Medium',
    type: 'sectional'
  }
];

// Sample notes
const notes = [
  {
    subject: 'Data Structures',
    chapter: 'arrays',
    title: 'Arrays and Strings',
    content: `## Arrays

An array is a collection of elements stored at contiguous memory locations.

### Time Complexities:
- Access: O(1)
- Search: O(n)
- Insertion: O(n)
- Deletion: O(n)

### Key Concepts:
1. Static Arrays: Fixed size
2. Dynamic Arrays: Can grow/shrink`
  },
  {
    subject: 'Data Structures',
    chapter: 'trees',
    title: 'Trees and Binary Trees',
    content: `## Trees

A tree is a hierarchical data structure.

### Binary Tree Properties:
- Maximum nodes at level L = 2^L
- Maximum nodes in tree of height H = 2^(H+1) - 1

### BST Operations:
- Search: O(log n) average, O(n) worst
- Insert: O(log n) average, O(n) worst`
  }
];

// Insert questions
console.log('📝 Inserting questions...');
const insertQuestion = db.prepare(`
  INSERT INTO questions (subject, topic, question, options, correct_answer, explanation, difficulty, year, marks, negative_marks)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

for (const q of questions) {
  insertQuestion.run(
    q.subject, q.topic, q.question, q.options, q.correct_answer,
    q.explanation, q.difficulty, q.year, q.marks, q.negative_marks
  );
}
console.log(`✅ Inserted ${questions.length} questions`);

// Insert tests
console.log('\n📋 Inserting tests...');
const insertTest = db.prepare(`
  INSERT INTO tests (title, description, duration, total_questions, total_marks, difficulty, type)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

for (const t of tests) {
  insertTest.run(t.title, t.description, t.duration, t.total_questions, t.total_marks, t.difficulty, t.type);
}
console.log(`✅ Inserted ${tests.length} tests`);

// Link questions to tests
console.log('\n🔗 Linking questions to tests...');
const insertTestQuestion = db.prepare(`
  INSERT INTO test_questions (test_id, question_id)
  VALUES (?, ?)
`);

const allQuestionIds = db.prepare('SELECT id FROM questions').all();
const allTestIds = db.prepare('SELECT id FROM tests').all();

// Add all questions to first test
for (const q of allQuestionIds) {
  insertTestQuestion.run(allTestIds[0].id, q.id);
}
console.log(`✅ Linked ${allQuestionIds.length} questions to tests`);

// Insert notes
console.log('\n📖 Inserting notes...');
const insertNote = db.prepare(`
  INSERT INTO notes (subject, chapter, title, content)
  VALUES (?, ?, ?, ?)
`);

for (const n of notes) {
  insertNote.run(n.subject, n.chapter, n.title, n.content);
}
console.log(`✅ Inserted ${notes.length} notes`);

// Create demo user
console.log('\n👤 Creating demo user...');
const hashedPassword = bcrypt.hashSync('demo123', 10);
try {
  db.prepare(`
    INSERT INTO users (name, email, password, branch)
    VALUES (?, ?, ?, ?)
  `).run('Demo User', 'demo@gateprep.com', hashedPassword, 'Computer Science (CS)');
  console.log('✅ Demo user created: demo@gateprep.com / demo123');
} catch (e) {
  console.log('ℹ️  Demo user already exists');
}

console.log('\n🎉 Database seeding completed successfully!');
console.log('\n📊 Summary:');
console.log(`   - Questions: ${questions.length}`);
console.log(`   - Tests: ${tests.length}`);
console.log(`   - Notes: ${notes.length}`);
console.log('\n🔐 Demo credentials:');
console.log('   Email: demo@gateprep.com');
console.log('   Password: demo123');
