import React, { useState } from 'react';
import { FileText, Book, Calculator, ChevronDown, ChevronUp, Bookmark, Download, Search } from 'lucide-react';

const notes = [
  {
    id: 1,
    subject: 'Data Structures',
    icon: '🔢',
    chapters: [
      {
        id: 'ds-1',
        title: 'Arrays and Strings',
        content: `
## Arrays

An array is a collection of elements stored at contiguous memory locations. It allows random access to elements using indices.

### Time Complexities:
- **Access**: O(1)
- **Search**: O(n) [O(log n) if sorted using binary search]
- **Insertion**: O(n) [At end: O(1) amortized]
- **Deletion**: O(n)

### Key Concepts:
1. **Static Arrays**: Fixed size, allocated at compile time
2. **Dynamic Arrays**: Can grow/shrink, allocated at runtime

### Important Problems:
- Two Sum
- Maximum Subarray (Kadane's Algorithm)
- Merge Intervals
- Product of Array Except Self

### Formula Sheet:
- Sum of elements: \\( \\sum_{i=0}^{n-1} a[i] \\)
- Average: \\( \\frac{\\sum_{i=0}^{n-1} a[i]}{n} \\)
        `,
      },
      {
        id: 'ds-2',
        title: 'Linked Lists',
        content: `
## Linked Lists

A linked list is a linear data structure where elements are stored in nodes, and each node points to the next node.

### Types:
1. **Singly Linked List**: Each node has data and next pointer
2. **Doubly Linked List**: Each node has data, next, and prev pointers
3. **Circular Linked List**: Last node points to first node

### Time Complexities:
| Operation | Singly LL | Doubly LL |
|-----------|-----------|-----------|
| Access    | O(n)      | O(n)      |
| Search    | O(n)      | O(n)      |
| Insert (beginning) | O(1) | O(1) |
| Insert (end) | O(n)* | O(1)** |
| Delete (beginning) | O(1) | O(1) |

*O(1) if we maintain tail pointer
**With tail pointer

### Key Operations:
- Reversal of linked list
- Detecting cycle (Floyd's algorithm)
- Finding middle element
- Merging two sorted lists
        `,
      },
      {
        id: 'ds-3',
        title: 'Trees',
        content: `
## Trees

A tree is a hierarchical data structure consisting of nodes connected by edges.

### Binary Tree Properties:
- Maximum nodes at level L = 2^L
- Maximum nodes in tree of height H = 2^(H+1) - 1
- Minimum height for n nodes = ⌈log₂(n+1)⌉ - 1

### Binary Search Tree (BST):
- Left subtree values < root
- Right subtree values > root
- Inorder traversal gives sorted sequence

### AVL Tree:
- Self-balancing BST
- Balance factor = height(left) - height(right)
- |Balance factor| ≤ 1 for all nodes
- Minimum nodes: N(h) = N(h-1) + N(h-2) + 1

### Red-Black Tree:
1. Every node is either red or black
2. Root is always black
3. No two adjacent red nodes
4. Every path from root to NULL has same number of black nodes
        `,
      },
    ],
  },
  {
    id: 2,
    subject: 'Database Management Systems',
    icon: '🗄️',
    chapters: [
      {
        id: 'dbms-1',
        title: 'Relational Model & SQL',
        content: `
## Relational Model

### Keys:
- **Super Key**: Set of attributes that uniquely identifies a tuple
- **Candidate Key**: Minimal super key
- **Primary Key**: Chosen candidate key
- **Foreign Key**: References primary key of another table

### SQL Basics:

\`\`\`sql
-- SELECT with conditions
SELECT column1, column2
FROM table_name
WHERE condition
GROUP BY column
HAVING aggregate_condition
ORDER BY column ASC/DESC;

-- JOINs
INNER JOIN - Returns matching rows
LEFT JOIN - All left table rows + matching
RIGHT JOIN - All right table rows + matching
FULL OUTER JOIN - All rows from both tables
\`\`\`

### Aggregate Functions:
- COUNT(), SUM(), AVG(), MIN(), MAX()

### Important Concepts:
- NULL handling (IS NULL, COALESCE)
- Subqueries (correlated vs non-correlated)
- Views and Materialized Views
        `,
      },
      {
        id: 'dbms-2',
        title: 'Normalization',
        content: `
## Normalization

Process of organizing data to reduce redundancy and dependency.

### Normal Forms:

**1NF (First Normal Form)**
- No multi-valued attributes
- All attributes are atomic

**2NF (Second Normal Form)**
- Must be in 1NF
- No partial dependency (non-prime attribute on part of candidate key)

**3NF (Third Normal Form)**
- Must be in 2NF
- No transitive dependency
- For FD X→Y: X is superkey OR Y is prime attribute

**BCNF (Boyce-Codd Normal Form)**
- Must be in 3NF
- For every FD X→Y: X must be a superkey

**4NF**
- Must be in BCNF
- No multi-valued dependencies

### Decomposition Properties:
- **Lossless Join**: Original table can be reconstructed
- **Dependency Preserving**: All FDs can be checked
        `,
      },
    ],
  },
  {
    id: 3,
    subject: 'Operating Systems',
    icon: '💻',
    chapters: [
      {
        id: 'os-1',
        title: 'Process Management',
        content: `
## Process Management

### Process States:
1. **New**: Process is being created
2. **Ready**: Waiting to be assigned to processor
3. **Running**: Instructions are being executed
4. **Waiting**: Waiting for some event
5. **Terminated**: Process has finished execution

### Process Control Block (PCB):
- Process ID, State, Program Counter
- CPU registers, Memory management info
- I/O status, Accounting information

### CPU Scheduling Algorithms:

| Algorithm | Preemptive | Starvation |
|-----------|------------|------------|
| FCFS      | No         | No         |
| SJF       | No         | Yes        |
| SRTF      | Yes        | Yes        |
| Priority  | Both       | Yes        |
| Round Robin| Yes       | No         |

### Important Formulas:
- **Turnaround Time** = Completion Time - Arrival Time
- **Waiting Time** = Turnaround Time - Burst Time
- **Response Time** = First Response - Arrival Time
- **Throughput** = Number of processes / Total time
        `,
      },
      {
        id: 'os-2',
        title: 'Memory Management',
        content: `
## Memory Management

### Memory Allocation:
- **Contiguous**: First Fit, Best Fit, Worst Fit
- **Non-contiguous**: Paging, Segmentation

### Paging:
- Physical memory divided into fixed-size **frames**
- Logical memory divided into same-size **pages**
- **Page Table** maps pages to frames

**Formulas:**
- Logical Address = Page Number + Page Offset
- Page Number = Address / Page Size
- Page Offset = Address % Page Size
- Physical Address = (Frame Number × Page Size) + Offset

### Virtual Memory:
- **Demand Paging**: Load pages only when needed
- **Page Fault**: Page not in memory

### Page Replacement Algorithms:
1. **FIFO**: Replace oldest page
2. **LRU**: Replace least recently used
3. **Optimal**: Replace page used farthest in future

**Belady's Anomaly**: More frames can cause more page faults (FIFO)
        `,
      },
    ],
  },
  {
    id: 4,
    subject: 'Computer Networks',
    icon: '🌐',
    chapters: [
      {
        id: 'cn-1',
        title: 'OSI & TCP/IP Model',
        content: `
## Network Models

### OSI Model (7 Layers):
| Layer | Name | Function | Protocols/Devices |
|-------|------|----------|-------------------|
| 7 | Application | User interface | HTTP, FTP, SMTP |
| 6 | Presentation | Data translation | SSL, JPEG, MPEG |
| 5 | Session | Session management | NetBIOS, RPC |
| 4 | Transport | End-to-end delivery | TCP, UDP |
| 3 | Network | Routing | IP, ICMP, Router |
| 2 | Data Link | Framing | Ethernet, Switch |
| 1 | Physical | Bit transmission | Hub, Cable |

### TCP/IP Model (4 Layers):
1. **Application**: HTTP, FTP, SMTP, DNS
2. **Transport**: TCP, UDP
3. **Internet**: IP, ICMP, ARP
4. **Network Access**: Ethernet, Wi-Fi

### TCP vs UDP:
| Feature | TCP | UDP |
|---------|-----|-----|
| Connection | Connection-oriented | Connectionless |
| Reliability | Reliable | Unreliable |
| Ordering | Ordered | Unordered |
| Speed | Slower | Faster |
| Header Size | 20-60 bytes | 8 bytes |
        `,
      },
    ],
  },
];

const formulaSheets = [
  {
    id: 1,
    title: 'Time Complexity Cheat Sheet',
    category: 'Algorithms',
    formulas: [
      { name: 'Binary Search', value: 'O(log n)' },
      { name: 'Merge Sort', value: 'O(n log n)' },
      { name: 'Quick Sort (avg)', value: 'O(n log n)' },
      { name: 'Heap Operations', value: 'O(log n)' },
      { name: 'Graph DFS/BFS', value: 'O(V + E)' },
      { name: 'Dijkstra', value: 'O((V+E) log V)' },
    ],
  },
  {
    id: 2,
    title: 'Probability Formulas',
    category: 'Mathematics',
    formulas: [
      { name: 'Bayes Theorem', value: 'P(A|B) = P(B|A)P(A)/P(B)' },
      { name: 'Expected Value', value: 'E[X] = Σ x·P(x)' },
      { name: 'Variance', value: 'Var(X) = E[X²] - (E[X])²' },
      { name: 'Binomial', value: 'P(X=k) = C(n,k)·p^k·(1-p)^(n-k)' },
      { name: 'Poisson', value: 'P(X=k) = (λ^k·e^(-λ))/k!' },
    ],
  },
];

function RevisionNotes() {
  const [expandedSubject, setExpandedSubject] = useState(notes[0].id);
  const [selectedChapter, setSelectedChapter] = useState(notes[0].chapters[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarkedChapters, setBookmarkedChapters] = useState(new Set());

  const toggleBookmark = (chapterId) => {
    const newBookmarks = new Set(bookmarkedChapters);
    if (newBookmarks.has(chapterId)) {
      newBookmarks.delete(chapterId);
    } else {
      newBookmarks.add(chapterId);
    }
    setBookmarkedChapters(newBookmarks);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Revision Notes</h1>
          <p className="text-gray-500">Comprehensive notes and formula sheets for quick revision</p>
        </div>
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 w-64"
          />
        </div>
      </div>

      {/* Formula Sheets Quick Access */}
      <div className="grid md:grid-cols-2 gap-4">
        {formulaSheets.map((sheet) => (
          <div key={sheet.id} className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-5 text-white">
            <div className="flex items-center gap-3 mb-3">
              <Calculator size={24} />
              <div>
                <h3 className="font-semibold">{sheet.title}</h3>
                <p className="text-sm text-purple-100">{sheet.category}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {sheet.formulas.slice(0, 4).map((formula, idx) => (
                <div key={idx} className="bg-white/10 rounded-lg px-3 py-2">
                  <p className="text-xs text-purple-100">{formula.name}</p>
                  <p className="text-sm font-mono">{formula.value}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Notes Content */}
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar - Subject List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h2 className="font-semibold text-gray-800 mb-4">Subjects</h2>
            <div className="space-y-2">
              {notes.map((subject) => (
                <div key={subject.id}>
                  <button
                    onClick={() => setExpandedSubject(expandedSubject === subject.id ? null : subject.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                      expandedSubject === subject.id
                        ? 'bg-primary-50 text-primary-700'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{subject.icon}</span>
                      <span className="font-medium text-sm">{subject.subject}</span>
                    </div>
                    {expandedSubject === subject.id ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                  </button>
                  {expandedSubject === subject.id && (
                    <div className="ml-4 mt-1 space-y-1">
                      {subject.chapters.map((chapter) => (
                        <button
                          key={chapter.id}
                          onClick={() => setSelectedChapter(chapter)}
                          className={`w-full text-left text-sm p-2 rounded-lg transition-colors ${
                            selectedChapter?.id === chapter.id
                              ? 'bg-primary-100 text-primary-700 font-medium'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {chapter.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {selectedChapter ? (
            <div className="bg-white rounded-xl shadow-sm">
              {/* Chapter Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-800">{selectedChapter.title}</h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleBookmark(selectedChapter.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      bookmarkedChapters.has(selectedChapter.id)
                        ? 'text-yellow-500 bg-yellow-50'
                        : 'text-gray-400 hover:bg-gray-100'
                    }`}
                  >
                    <Bookmark size={20} />
                  </button>
                  <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg">
                    <Download size={20} />
                  </button>
                </div>
              </div>

              {/* Chapter Content */}
              <div className="p-6 prose prose-sm max-w-none">
                <div
                  className="whitespace-pre-wrap text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: selectedChapter.content
                      .replace(/## (.*)/g, '<h2 class="text-xl font-bold text-gray-800 mt-6 mb-3">$1</h2>')
                      .replace(/### (.*)/g, '<h3 class="text-lg font-semibold text-gray-700 mt-4 mb-2">$1</h3>')
                      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
                      .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>')
                      .replace(/\n- /g, '\n• ')
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <FileText size={48} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600">Select a chapter</h3>
              <p className="text-gray-500">Choose a topic from the sidebar to start reading</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RevisionNotes;
