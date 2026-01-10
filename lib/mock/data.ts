import { QAPair, User, Review, DashboardStats } from "@/lib/types"

// Mock users with different activity levels
export const mockUsers: User[] = [
  {
    id: "user-1",
    email: "user@example.com",
    name: "Alex Chen",
    picture: "",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "user-2",
    email: "demo@example.com",
    name: "Demo User",
    picture: "",
    createdAt: new Date("2024-06-01"),
  },
  {
    id: "user-3",
    email: "member1@example.com",
    name: "Member One",
    picture: "",
    createdAt: new Date("2024-03-20"),
  },
]

// Generate realistic QA pairs across different topics
export const mockQAPairs: QAPair[] = [
  // Programming - JavaScript
  {
    id: "qa-1",
    question: "What is the difference between `let`, `const`, and `var` in JavaScript?",
    answer: "`let` and `const` are block-scoped and introduced in ES6, while `var` is function-scoped. `const` cannot be reassigned after initialization, but `let` can. `var` has hoisting issues that can lead to unexpected behavior.",
    tags: ["javascript", "es6", "variables"],
    createdAt: new Date("2024-12-01"),
    nextReviewAt: new Date(Date.now() + 86400000), // tomorrow
    reviewCount: 5,
    userId: "user-1",
    reviewHistory: [],
  },
  {
    id: "qa-2",
    question: "Explain closures in JavaScript with an example",
    answer: "A closure is a function that has access to variables in its outer (enclosing) function's scope, even after the outer function has returned.\n\n```javascript\nfunction outer() {\n  let count = 0;\n  return function inner() {\n    count++;\n    return count;\n  }\n}\nconst counter = outer();\ncounter(); // 1\ncounter(); // 2\n```",
    tags: ["javascript", "closures", "scope"],
    createdAt: new Date("2024-12-02"),
    nextReviewAt: new Date(Date.now() - 3600000), // 1 hour ago (due for review)
    reviewCount: 3,
    userId: "user-1",
    reviewHistory: [],
  },
  {
    id: "qa-3",
    question: "What is the event loop in JavaScript?",
    answer: "The event loop is JavaScript's mechanism for handling asynchronous operations. It continuously checks the call stack and task queues (microtasks and macrotasks), executing tasks when the call stack is empty. This enables non-blocking I/O operations despite JavaScript being single-threaded.",
    tags: ["javascript", "async", "event-loop"],
    createdAt: new Date("2024-12-03"),
    nextReviewAt: new Date(Date.now() + 172800000), // 2 days from now
    reviewCount: 7,
    userId: "user-1",
    reviewHistory: [],
  },
  {
    id: "qa-4",
    question: "What are Promises in JavaScript and how do they work?",
    answer: "Promises represent the eventual completion or failure of an asynchronous operation. They have three states: pending, fulfilled, or rejected.\n\n```javascript\nconst promise = new Promise((resolve, reject) => {\n  if (success) resolve(value);\n  else reject(error);\n});\n\npromise\n  .then(result => console.log(result))\n  .catch(error => console.error(error));\n```",
    tags: ["javascript", "promises", "async"],
    createdAt: new Date("2024-12-04"),
    nextReviewAt: new Date(Date.now() - 7200000), // 2 hours ago (due)
    reviewCount: 4,
    userId: "user-1",
    reviewHistory: [],
  },
  {
    id: "qa-5",
    question: "Difference between `==` and `===` in JavaScript?",
    answer: "`===` (strict equality) checks both value and type without type coercion, while `==` (loose equality) performs type coercion before comparison.\n\nExample:\n```javascript\n5 == '5'   // true (type coercion)\n5 === '5'  // false (different types)\n```",
    tags: ["javascript", "operators", "equality"],
    createdAt: new Date("2024-12-05"),
    nextReviewAt: new Date(Date.now() + 86400000),
    reviewCount: 2,
    userId: "user-1",
    reviewHistory: [],
  },

  // Programming - React
  {
    id: "qa-6",
    question: "What are React Hooks and why were they introduced?",
    answer: "React Hooks are functions that let you use state and other React features in functional components. They were introduced to:\n\n1. Reuse stateful logic without changing component hierarchy\n2. Split complex components into smaller functions\n3. Use React features without classes\n\nCommon hooks: `useState`, `useEffect`, `useContext`, `useCallback`, `useMemo`",
    tags: ["react", "hooks", "frontend"],
    createdAt: new Date("2024-12-06"),
    nextReviewAt: new Date(Date.now() + 259200000), // 3 days
    reviewCount: 6,
    userId: "user-1",
    reviewHistory: [],
  },
  {
    id: "qa-7",
    question: "Explain the Virtual DOM in React",
    answer: "The Virtual DOM is a lightweight copy of the actual DOM kept in memory. When state changes:\n\n1. React creates a new Virtual DOM tree\n2. Compares it with the previous version (diffing)\n3. Calculates the minimum changes needed\n4. Updates only those parts in the real DOM (reconciliation)\n\nThis makes updates more efficient than manipulating the DOM directly.",
    tags: ["react", "virtual-dom", "performance"],
    createdAt: new Date("2024-12-07"),
    nextReviewAt: new Date(Date.now() - 1800000), // 30 min ago (due)
    reviewCount: 5,
    userId: "user-1",
    reviewHistory: [],
  },
  {
    id: "qa-8",
    question: "What is useEffect and when should you use it?",
    answer: "`useEffect` is a Hook for performing side effects in function components. Use it for:\n\n- Data fetching\n- Subscriptions\n- Manual DOM manipulation\n- Timers\n\n```javascript\nuseEffect(() => {\n  // Side effect code\n  return () => {/* Cleanup */};\n}, [dependencies]);\n```\n\nThe dependency array controls when the effect runs.",
    tags: ["react", "hooks", "useEffect"],
    createdAt: new Date("2024-12-08"),
    nextReviewAt: new Date(Date.now() + 43200000), // 12 hours
    reviewCount: 3,
    userId: "user-1",
    reviewHistory: [],
  },

  // Programming - Python
  {
    id: "qa-9",
    question: "What are Python decorators and how do they work?",
    answer: "Decorators are functions that modify the behavior of other functions or classes. They use the `@` syntax:\n\n```python\ndef log_calls(func):\n    def wrapper(*args, **kwargs):\n        print(f'Calling {func.__name__}')\n        return func(*args, **kwargs)\n    return wrapper\n\n@log_calls\ndef greet(name):\n    return f'Hello {name}'\n```\n\nDecorators wrap the original function, adding functionality before/after execution.",
    tags: ["python", "decorators", "functions"],
    createdAt: new Date("2024-12-09"),
    nextReviewAt: new Date(Date.now() + 604800000), // 7 days
    reviewCount: 8,
    userId: "user-1",
    reviewHistory: [],
  },
  {
    id: "qa-10",
    question: "Explain list comprehensions in Python",
    answer: "List comprehensions provide a concise way to create lists based on existing lists.\n\n```python\n# Traditional approach\nsquares = []\nfor x in range(10):\n    squares.append(x**2)\n\n# List comprehension\nsquares = [x**2 for x in range(10)]\n\n# With condition\neven_squares = [x**2 for x in range(10) if x % 2 == 0]\n```\n\nThey're more readable and often faster than traditional loops.",
    tags: ["python", "list-comprehension", "syntax"],
    createdAt: new Date("2024-12-10"),
    nextReviewAt: new Date(Date.now() - 10800000), // 3 hours ago (due)
    reviewCount: 2,
    userId: "user-1",
    reviewHistory: [],
  },

  // Data Structures
  {
    id: "qa-11",
    question: "What is a Hash Table and what is its time complexity?",
    answer: "A hash table (hash map) stores key-value pairs using a hash function to compute an index.\n\n**Time Complexity:**\n- Average case: O(1) for insert, delete, search\n- Worst case: O(n) when many collisions occur\n\n**Collision Resolution:**\n- Chaining (linked lists)\n- Open addressing (linear probing, quadratic probing)\n\nPython's `dict` and JavaScript's `Object`/`Map` use hash tables internally.",
    tags: ["data-structures", "hash-table", "algorithms"],
    createdAt: new Date("2024-12-11"),
    nextReviewAt: new Date(Date.now() + 345600000), // 4 days
    reviewCount: 4,
    userId: "user-1",
    reviewHistory: [],
  },
  {
    id: "qa-12",
    question: "Difference between Stack and Queue?",
    answer: "**Stack (LIFO - Last In First Out):**\n- Operations: push (add), pop (remove), peek (view top)\n- Use cases: function calls, undo operations, backtracking\n\n**Queue (FIFO - First In First Out):**\n- Operations: enqueue (add), dequeue (remove), peek (view front)\n- Use cases: task scheduling, BFS, message queues\n\nBoth have O(1) time complexity for their main operations.",
    tags: ["data-structures", "stack", "queue"],
    createdAt: new Date("2024-12-12"),
    nextReviewAt: new Date(Date.now() - 5400000), // 1.5 hours ago (due)
    reviewCount: 6,
    userId: "user-1",
    reviewHistory: [],
  },

  // Algorithms
  {
    id: "qa-13",
    question: "Explain Binary Search and its time complexity",
    answer: "Binary Search finds an element in a **sorted** array by repeatedly dividing the search interval in half.\n\n```python\ndef binary_search(arr, target):\n    left, right = 0, len(arr) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1\n```\n\n**Time Complexity:** O(log n)\n**Space Complexity:** O(1) iterative, O(log n) recursive",
    tags: ["algorithms", "binary-search", "searching"],
    createdAt: new Date("2024-12-13"),
    nextReviewAt: new Date(Date.now() + 172800000), // 2 days
    reviewCount: 5,
    userId: "user-1",
    reviewHistory: [],
  },
  {
    id: "qa-14",
    question: "What is the difference between BFS and DFS?",
    answer: "**BFS (Breadth-First Search):**\n- Uses a queue\n- Explores level by level\n- Finds shortest path in unweighted graphs\n- Space: O(w) where w is max width\n\n**DFS (Depth-First Search):**\n- Uses a stack (or recursion)\n- Explores as deep as possible first\n- Better for detecting cycles, topological sort\n- Space: O(h) where h is max depth\n\nBoth have O(V + E) time complexity for graphs.",
    tags: ["algorithms", "graph", "bfs", "dfs"],
    createdAt: new Date("2024-12-14"),
    nextReviewAt: new Date(Date.now() + 86400000), // 1 day
    reviewCount: 7,
    userId: "user-1",
    reviewHistory: [],
  },

  // System Design
  {
    id: "qa-15",
    question: "What is the CAP theorem?",
    answer: "The CAP theorem states that a distributed system can only guarantee 2 out of 3 properties:\n\n**C (Consistency):** All nodes see the same data at the same time\n**A (Availability):** Every request receives a response\n**P (Partition Tolerance):** System continues operating despite network partitions\n\n**Trade-offs:**\n- CP systems: MongoDB, HBase (sacrifice availability)\n- AP systems: Cassandra, DynamoDB (sacrifice consistency)\n- CA systems: Traditional RDBMS (no partition tolerance)",
    tags: ["system-design", "distributed-systems", "cap-theorem"],
    createdAt: new Date("2024-12-15"),
    nextReviewAt: new Date(Date.now() + 432000000), // 5 days
    reviewCount: 3,
    userId: "user-1",
    reviewHistory: [],
  },

  // Database
  {
    id: "qa-16",
    question: "What are database indexes and when should you use them?",
    answer: "An index is a data structure (usually B-tree) that improves data retrieval speed.\n\n**When to use:**\n- Columns frequently used in WHERE, JOIN, ORDER BY\n- Columns with high selectivity (many unique values)\n\n**Trade-offs:**\n- Faster reads (O(log n) vs O(n))\n- Slower writes (must update index)\n- More storage space\n\n**Types:** B-tree, Hash, Full-text, Spatial\n\n```sql\nCREATE INDEX idx_email ON users(email);\n```",
    tags: ["database", "indexes", "performance"],
    createdAt: new Date("2024-12-16"),
    nextReviewAt: new Date(Date.now() - 14400000), // 4 hours ago (due)
    reviewCount: 4,
    userId: "user-1",
    reviewHistory: [],
  },
  {
    id: "qa-17",
    question: "Difference between SQL and NoSQL databases?",
    answer: "**SQL (Relational):**\n- Fixed schema\n- ACID transactions\n- Vertical scaling\n- Examples: PostgreSQL, MySQL\n- Use when: Complex queries, strong consistency needed\n\n**NoSQL:**\n- Flexible schema\n- Eventual consistency (usually)\n- Horizontal scaling\n- Types: Document (MongoDB), Key-Value (Redis), Column (Cassandra), Graph (Neo4j)\n- Use when: Massive scale, flexible schema, high throughput",
    tags: ["database", "sql", "nosql"],
    createdAt: new Date("2024-12-17"),
    nextReviewAt: new Date(Date.now() + 259200000), // 3 days
    reviewCount: 6,
    userId: "user-1",
    reviewHistory: [],
  },

  // Networking
  {
    id: "qa-18",
    question: "Explain HTTP status codes: 2xx, 3xx, 4xx, 5xx",
    answer: "**2xx Success:**\n- 200 OK: Request succeeded\n- 201 Created: Resource created\n- 204 No Content: Success but no response body\n\n**3xx Redirection:**\n- 301 Moved Permanently\n- 302 Found (temporary redirect)\n- 304 Not Modified (cached)\n\n**4xx Client Error:**\n- 400 Bad Request\n- 401 Unauthorized\n- 403 Forbidden\n- 404 Not Found\n\n**5xx Server Error:**\n- 500 Internal Server Error\n- 502 Bad Gateway\n- 503 Service Unavailable",
    tags: ["networking", "http", "status-codes"],
    createdAt: new Date("2024-12-18"),
    nextReviewAt: new Date(Date.now() + 86400000),
    reviewCount: 5,
    userId: "user-1",
    reviewHistory: [],
  },
  {
    id: "qa-19",
    question: "What is the difference between HTTP and HTTPS?",
    answer: "**HTTP (HyperText Transfer Protocol):**\n- Unencrypted communication\n- Port 80\n- Vulnerable to man-in-the-middle attacks\n\n**HTTPS (HTTP Secure):**\n- Encrypted using TLS/SSL\n- Port 443\n- Provides:\n  - Encryption (data privacy)\n  - Authentication (verify server identity)\n  - Integrity (detect tampering)\n\nHTTPS uses public key cryptography for key exchange, then symmetric encryption for data transfer.",
    tags: ["networking", "http", "https", "security"],
    createdAt: new Date("2024-12-19"),
    nextReviewAt: new Date(Date.now() - 21600000), // 6 hours ago (due)
    reviewCount: 3,
    userId: "user-1",
    reviewHistory: [],
  },

  // Security
  {
    id: "qa-20",
    question: "What is SQL Injection and how to prevent it?",
    answer: "SQL Injection is a code injection attack where malicious SQL statements are inserted into input fields.\n\n**Example Attack:**\n```sql\n-- Input: ' OR '1'='1\nSELECT * FROM users WHERE username = '' OR '1'='1';\n```\n\n**Prevention:**\n1. **Parameterized queries** (prepared statements)\n2. Input validation and sanitization\n3. Least privilege database accounts\n4. ORM frameworks\n5. Web Application Firewall (WAF)\n\n```python\n# Safe\ncursor.execute(\"SELECT * FROM users WHERE id = ?\", (user_id,))\n```",
    tags: ["security", "sql-injection", "owasp"],
    createdAt: new Date("2024-12-20"),
    nextReviewAt: new Date(Date.now() + 518400000), // 6 days
    reviewCount: 2,
    userId: "user-1",
    reviewHistory: [],
  },

  // More diverse topics
  {
    id: "qa-21",
    question: "What is REST and what are its principles?",
    answer: "REST (Representational State Transfer) is an architectural style for designing networked applications.\n\n**Core Principles:**\n1. **Stateless:** Each request contains all necessary information\n2. **Client-Server:** Separation of concerns\n3. **Cacheable:** Responses must define if cacheable\n4. **Uniform Interface:** Consistent way to interact with resources\n5. **Layered System:** Client doesn't know if connected directly to server\n\n**RESTful API Uses:**\n- HTTP methods: GET, POST, PUT, DELETE, PATCH\n- Resource-based URLs: `/users/123`, not `/getUser?id=123`",
    tags: ["api", "rest", "web-services"],
    createdAt: new Date("2024-12-21"),
    nextReviewAt: new Date(Date.now() + 172800000),
    reviewCount: 4,
    userId: "user-1",
    reviewHistory: [],
  },
  {
    id: "qa-22",
    question: "What is Docker and why use containers?",
    answer: "Docker is a platform for developing, shipping, and running applications in containers.\n\n**Container Benefits:**\n- **Isolation:** Apps run in isolated environments\n- **Portability:** \"Works on my machine\" → works everywhere\n- **Efficiency:** Share OS kernel, lighter than VMs\n- **Consistency:** Same environment dev → prod\n- **Scalability:** Easy to replicate\n\n**Key Components:**\n- Image: Blueprint for container\n- Container: Running instance\n- Dockerfile: Instructions to build image\n- Docker Compose: Multi-container orchestration",
    tags: ["docker", "containers", "devops"],
    createdAt: new Date("2024-12-22"),
    nextReviewAt: new Date(Date.now() + 86400000),
    reviewCount: 5,
    userId: "user-1",
    reviewHistory: [],
  },
  {
    id: "qa-23",
    question: "What is Git rebase vs Git merge?",
    answer: "**Git Merge:**\n```bash\ngit merge feature-branch\n```\n- Creates a merge commit\n- Preserves complete history\n- Non-destructive\n- Better for shared branches\n\n**Git Rebase:**\n```bash\ngit rebase main\n```\n- Rewrites commit history\n- Creates linear history\n- Cleaner project history\n- **Never rebase public/shared branches!**\n\nUse merge for public branches, rebase for cleaning up local feature branches.",
    tags: ["git", "version-control", "rebase", "merge"],
    createdAt: new Date("2024-12-23"),
    nextReviewAt: new Date(Date.now() - 43200000), // 12 hours ago (due)
    reviewCount: 3,
    userId: "user-1",
    reviewHistory: [],
  },
  {
    id: "qa-24",
    question: "What is CI/CD?",
    answer: "**CI (Continuous Integration):**\n- Automatically build and test code when pushed\n- Merge code to main branch frequently\n- Catch bugs early\n\n**CD (Continuous Delivery/Deployment):**\n- **Delivery:** Automatically prepare for release\n- **Deployment:** Automatically deploy to production\n\n**Benefits:**\n- Faster feedback\n- Reduced integration problems\n- Automated testing\n- Faster time to market\n\n**Tools:** Jenkins, GitHub Actions, GitLab CI, CircleCI",
    tags: ["devops", "ci-cd", "automation"],
    createdAt: new Date("2024-12-24"),
    nextReviewAt: new Date(Date.now() + 259200000),
    reviewCount: 6,
    userId: "user-1",
    reviewHistory: [],
  },
  {
    id: "qa-25",
    question: "Explain OAuth 2.0 flow",
    answer: "OAuth 2.0 is an authorization framework for delegating access.\n\n**Authorization Code Flow:**\n1. User clicks \"Login with Google\"\n2. Redirected to authorization server\n3. User grants permission\n4. Server redirects back with authorization code\n5. App exchanges code for access token\n6. App uses token to access protected resources\n\n**Roles:**\n- Resource Owner: User\n- Client: Your app\n- Authorization Server: Google, GitHub, etc.\n- Resource Server: API with user data\n\n**Token Types:** Access token (short-lived), Refresh token (long-lived)",
    tags: ["security", "oauth", "authentication"],
    createdAt: new Date("2024-12-25"),
    nextReviewAt: new Date(Date.now() + 432000000),
    reviewCount: 2,
    userId: "user-1",
    reviewHistory: [],
  },

  // Frontend Performance
  {
    id: "qa-26",
    question: "What is lazy loading and code splitting?",
    answer: "**Lazy Loading:**\nDefer loading resources until needed.\n\n**Code Splitting:**\nBreak bundles into smaller chunks loaded on demand.\n\n**React Example:**\n```javascript\nconst LazyComponent = React.lazy(() => import('./Component'));\n\nfunction App() {\n  return (\n    <Suspense fallback={<Loading />}>\n      <LazyComponent />\n    </Suspense>\n  );\n}\n```\n\n**Benefits:**\n- Faster initial load\n- Smaller bundle size\n- Better performance on mobile\n\n**Use for:** Routes, modals, tabs, images",
    tags: ["performance", "react", "optimization"],
    createdAt: new Date("2024-12-26"),
    nextReviewAt: new Date(Date.now() + 86400000),
    reviewCount: 4,
    userId: "user-1",
    reviewHistory: [],
  },

  // TypeScript
  {
    id: "qa-27",
    question: "What are TypeScript generics and why use them?",
    answer: "Generics allow you to create reusable components that work with multiple types.\n\n**Example:**\n```typescript\nfunction identity<T>(arg: T): T {\n  return arg;\n}\n\nidentity<string>(\"hello\"); // T is string\nidentity<number>(42);      // T is number\n\n// Generic Interface\ninterface Box<T> {\n  value: T;\n}\n\nconst stringBox: Box<string> = { value: \"hello\" };\n```\n\n**Benefits:**\n- Type safety with flexibility\n- Code reusability\n- Better IDE support\n- Catch errors at compile time",
    tags: ["typescript", "generics", "types"],
    createdAt: new Date("2024-12-27"),
    nextReviewAt: new Date(Date.now() - 28800000), // 8 hours ago (due)
    reviewCount: 3,
    userId: "user-1",
    reviewHistory: [],
  },

  // Additional topics to reach ~50 QA pairs
  {
    id: "qa-28",
    question: "What is memoization in programming?",
    answer: "Memoization is an optimization technique that caches function results based on inputs.\n\n**Example (Fibonacci):**\n```javascript\nconst memo = {};\nfunction fib(n) {\n  if (n <= 1) return n;\n  if (memo[n]) return memo[n];\n  \n  memo[n] = fib(n - 1) + fib(n - 2);\n  return memo[n];\n}\n```\n\n**React:**\n```javascript\nconst MemoizedComponent = React.memo(Component);\nconst memoizedValue = useMemo(() => expensive(), [deps]);\nconst memoizedCallback = useCallback(() => fn(), [deps]);\n```\n\nReduces time complexity from O(2^n) to O(n) for recursive problems.",
    tags: ["optimization", "memoization", "algorithms"],
    createdAt: new Date("2024-12-28"),
    nextReviewAt: new Date(Date.now() + 172800000),
    reviewCount: 5,
    userId: "user-1",
    reviewHistory: [],
  },
  {
    id: "qa-29",
    question: "What is CORS and how does it work?",
    answer: "CORS (Cross-Origin Resource Sharing) is a security feature that restricts web pages from making requests to a different domain.\n\n**Why it exists:**\nPrevents malicious sites from accessing your data.\n\n**How it works:**\n1. Browser sends preflight OPTIONS request\n2. Server responds with allowed origins\n3. Browser allows/blocks based on response\n\n**Server Headers:**\n```\nAccess-Control-Allow-Origin: https://example.com\nAccess-Control-Allow-Methods: GET, POST\nAccess-Control-Allow-Headers: Content-Type\n```\n\n**Solutions:**\n- Configure server to allow specific origins\n- Use proxy in development\n- Server-side API calls",
    tags: ["networking", "cors", "security"],
    createdAt: new Date("2024-12-29"),
    nextReviewAt: new Date(Date.now() + 86400000),
    reviewCount: 4,
    userId: "user-1",
    reviewHistory: [],
  },
  {
    id: "qa-30",
    question: "What is the difference between TCP and UDP?",
    answer: "**TCP (Transmission Control Protocol):**\n- Connection-oriented\n- Reliable (guarantees delivery)\n- Ordered packets\n- Error checking and recovery\n- Slower\n- Use: HTTP, HTTPS, FTP, Email\n\n**UDP (User Datagram Protocol):**\n- Connectionless\n- Unreliable (no delivery guarantee)\n- No ordering\n- Minimal error checking\n- Faster\n- Use: Video streaming, gaming, DNS, VoIP\n\n**Analogy:**\nTCP = Registered mail (tracked)\nUDP = Regular mail (fire and forget)",
    tags: ["networking", "tcp", "udp"],
    createdAt: new Date("2024-12-30"),
    nextReviewAt: new Date(Date.now() + 259200000),
    reviewCount: 6,
    userId: "user-1",
    reviewHistory: [],
  },
  {
    id: "qa-31",
    question: "What is Big O notation?",
    answer: "Big O describes the worst-case time/space complexity as input size grows.\n\n**Common Complexities (best to worst):**\n- O(1): Constant - array access\n- O(log n): Logarithmic - binary search\n- O(n): Linear - simple loop\n- O(n log n): Linearithmic - merge sort\n- O(n²): Quadratic - nested loops\n- O(2^n): Exponential - recursive fibonacci\n- O(n!): Factorial - permutations\n\n**Example:**\n```python\ndef find_max(arr):  # O(n)\n    max_val = arr[0]\n    for num in arr:\n        if num > max_val:\n            max_val = num\n    return max_val\n```",
    tags: ["algorithms", "big-o", "complexity"],
    createdAt: new Date("2024-12-31"),
    nextReviewAt: new Date(Date.now() - 36000000), // 10 hours ago (due)
    reviewCount: 8,
    userId: "user-1",
    reviewHistory: [],
  },
  {
    id: "qa-32",
    question: "What is the difference between Authentication and Authorization?",
    answer: "**Authentication (AuthN):**\nVerifying **who you are**\n- Login with username/password\n- Multi-factor authentication\n- Biometrics\n- OAuth, JWT tokens\n\n**Authorization (AuthZ):**\nVerifying **what you can do**\n- Permissions and roles\n- Access control lists (ACL)\n- Role-based access control (RBAC)\n\n**Example:**\n- Authentication: Proving you're employee #1234\n- Authorization: Checking if #1234 can access HR records\n\nYou can be authenticated but not authorized!",
    tags: ["security", "authentication", "authorization"],
    createdAt: new Date("2025-01-01"),
    nextReviewAt: new Date(Date.now() + 432000000),
    reviewCount: 3,
    userId: "user-1",
    reviewHistory: [],
  },
  {
    id: "qa-33",
    question: "What is debouncing and throttling?",
    answer: "Both limit how often a function executes.\n\n**Debouncing:**\nDelay execution until user stops triggering\n```javascript\nfunction debounce(func, delay) {\n  let timeout;\n  return (...args) => {\n    clearTimeout(timeout);\n    timeout = setTimeout(() => func(...args), delay);\n  };\n}\n// Use: Search autocomplete\n```\n\n**Throttling:**\nExecute at most once per time period\n```javascript\nfunction throttle(func, limit) {\n  let inThrottle;\n  return (...args) => {\n    if (!inThrottle) {\n      func(...args);\n      inThrottle = true;\n      setTimeout(() => inThrottle = false, limit);\n    }\n  };\n}\n// Use: Scroll events, window resize\n```",
    tags: ["javascript", "performance", "optimization"],
    createdAt: new Date("2025-01-02"),
    nextReviewAt: new Date(Date.now() + 86400000),
    reviewCount: 5,
    userId: "user-1",
    reviewHistory: [],
  },
  {
    id: "qa-34",
    question: "What is the difference between `null` and `undefined` in JavaScript?",
    answer: "**undefined:**\n- Variable declared but not assigned\n- Default parameter value\n- Missing object property\n- Function with no return\n\n**null:**\n- Intentional absence of value\n- Must be assigned explicitly\n- Represents \"no object\"\n\n**Examples:**\n```javascript\nlet x;              // undefined\nlet y = null;       // null\n\nconst obj = { a: 1 };\nobj.b;              // undefined\nobj.c = null;       // explicitly null\n\ntypeof undefined;   // \"undefined\"\ntypeof null;        // \"object\" (JavaScript bug)\n```",
    tags: ["javascript", "types", "null", "undefined"],
    createdAt: new Date("2025-01-03"),
    nextReviewAt: new Date(Date.now() + 172800000),
    reviewCount: 4,
    userId: "user-1",
    reviewHistory: [],
  },
  {
    id: "qa-35",
    question: "What is load balancing and what are common algorithms?",
    answer: "Load balancing distributes network traffic across multiple servers.\n\n**Common Algorithms:**\n\n1. **Round Robin:** Rotate through servers sequentially\n2. **Least Connections:** Send to server with fewest active connections\n3. **IP Hash:** Same client always goes to same server\n4. **Weighted Round Robin:** Distribute based on server capacity\n5. **Random:** Pick random server\n\n**Types:**\n- Layer 4 (Transport): Based on IP, port\n- Layer 7 (Application): Based on HTTP headers, content\n\n**Tools:** Nginx, HAProxy, AWS ELB, GCP Load Balancer",
    tags: ["system-design", "load-balancing", "scalability"],
    createdAt: new Date("2025-01-04"),
    nextReviewAt: new Date(Date.now() + 259200000),
    reviewCount: 2,
    userId: "user-1",
    reviewHistory: [],
  },
  {
    id: "qa-36",
    question: "What is the difference between cookies, localStorage, and sessionStorage?",
    answer: "**Cookies:**\n- Size: 4KB\n- Sent with every HTTP request\n- Can set expiration\n- Accessible from server and client\n- Use: Authentication, tracking\n\n**localStorage:**\n- Size: 5-10MB\n- Never sent to server\n- Persists until manually cleared\n- Client-side only\n- Use: User preferences, cached data\n\n**sessionStorage:**\n- Size: 5-10MB\n- Never sent to server\n- Cleared when tab closes\n- Client-side only\n- Use: Form data, temporary state\n\nAll are vulnerable to XSS attacks - never store sensitive data!",
    tags: ["web", "storage", "cookies"],
    createdAt: new Date("2025-01-05"),
    nextReviewAt: new Date(Date.now() + 86400000),
    reviewCount: 6,
    userId: "user-1",
    reviewHistory: [],
  },
  {
    id: "qa-37",
    question: "What is dependency injection?",
    answer: "Dependency Injection is a design pattern where objects receive their dependencies from external sources rather than creating them.\n\n**Without DI:**\n```python\nclass UserService:\n    def __init__(self):\n        self.db = Database()  # Hard dependency\n```\n\n**With DI:**\n```python\nclass UserService:\n    def __init__(self, db):\n        self.db = db  # Injected dependency\n\n# Usage\ndb = Database()\nservice = UserService(db)\n```\n\n**Benefits:**\n- Easier testing (mock dependencies)\n- Better modularity\n- Loose coupling\n- Easier to change implementations\n\n**Frameworks:** Spring (Java), Angular (TypeScript)",
    tags: ["design-patterns", "dependency-injection", "architecture"],
    createdAt: new Date("2025-01-06"),
    nextReviewAt: new Date(Date.now() + 432000000),
    reviewCount: 3,
    userId: "user-1",
    reviewHistory: [],
  },
  {
    id: "qa-38",
    question: "What is a microservices architecture?",
    answer: "Microservices is an architectural style where an application is built as a collection of small, independent services.\n\n**Characteristics:**\n- Each service runs independently\n- Communicates via APIs (REST, gRPC, message queues)\n- Own database per service\n- Deployed independently\n- Different tech stacks possible\n\n**vs Monolith:**\n\n**Pros:**\n- Easier to scale specific services\n- Technology flexibility\n- Fault isolation\n- Faster deployment\n\n**Cons:**\n- Complex infrastructure\n- Network latency\n- Distributed debugging\n- Data consistency challenges\n\n**Tools:** Kubernetes, Docker, Service Mesh (Istio)",
    tags: ["architecture", "microservices", "system-design"],
    createdAt: new Date("2025-01-07"),
    nextReviewAt: new Date(Date.now() + 172800000),
    reviewCount: 4,
    userId: "user-1",
    reviewHistory: [],
  },
  {
    id: "qa-39",
    question: "What is the difference between process and thread?",
    answer: "**Process:**\n- Independent execution unit\n- Own memory space\n- Heavy-weight\n- Inter-process communication (IPC) needed\n- Crashing one doesn't affect others\n- Example: Running Chrome browser\n\n**Thread:**\n- Lightweight execution unit within a process\n- Shares memory with other threads\n- Light-weight\n- Direct communication (shared memory)\n- Crashing one can crash whole process\n- Example: Multiple tabs in Chrome\n\n**Multithreading Benefits:**\n- Better resource utilization\n- Faster context switching\n- Easier communication\n\n**Note:** Python has GIL (Global Interpreter Lock) limiting true parallelism with threads.",
    tags: ["operating-systems", "concurrency", "processes", "threads"],
    createdAt: new Date("2025-01-08"),
    nextReviewAt: new Date(Date.now() + 86400000),
    reviewCount: 5,
    userId: "user-1",
    reviewHistory: [],
  },
  {
    id: "qa-40",
    question: "What is GraphQL and how is it different from REST?",
    answer: "GraphQL is a query language for APIs that lets clients request exactly the data they need.\n\n**Key Differences:**\n\n**REST:**\n- Multiple endpoints (`/users`, `/posts`)\n- Fixed response structure\n- Over-fetching or under-fetching\n- Versioning needed\n\n**GraphQL:**\n- Single endpoint\n- Client specifies needed fields\n- Get exactly what you request\n- Strong typing\n- Introspection\n\n**Example Query:**\n```graphql\nquery {\n  user(id: \"123\") {\n    name\n    email\n    posts {\n      title\n    }\n  }\n}\n```\n\n**When to use GraphQL:**\n- Mobile apps (reduce bandwidth)\n- Complex nested data\n- Frequent UI changes",
    tags: ["api", "graphql", "rest"],
    createdAt: new Date("2025-01-09"),
    nextReviewAt: new Date(Date.now() + 259200000),
    reviewCount: 3,
    userId: "user-1",
    reviewHistory: [],
  },

  // Additional QA pairs for variety
  {
    id: "qa-41",
    question: "What is Redis and what are common use cases?",
    answer: "Redis is an in-memory data structure store used as database, cache, and message broker.\n\n**Data Structures:**\n- Strings, Lists, Sets, Sorted Sets, Hashes\n- Bitmaps, HyperLogLogs, Streams\n\n**Common Use Cases:**\n\n1. **Caching:** Store frequently accessed data\n2. **Session Storage:** User sessions\n3. **Rate Limiting:** Track API calls\n4. **Leaderboards:** Sorted sets for rankings\n5. **Pub/Sub:** Real-time messaging\n6. **Job Queues:** Background tasks\n\n**Benefits:**\n- Extremely fast (in-memory)\n- Supports complex data types\n- Persistence options\n- Atomic operations\n\n**Commands:**\n```redis\nSET key value\nGET key\nEXPIRE key 3600\n```",
    tags: ["database", "redis", "caching"],
    createdAt: new Date("2024-11-15"),
    nextReviewAt: new Date(Date.now() + 518400000),
    reviewCount: 7,
    userId: "user-1",
    reviewHistory: [],
  },
  {
    id: "qa-42",
    question: "What is the Singleton design pattern?",
    answer: "Singleton ensures a class has only one instance and provides global access to it.\n\n**Implementation:**\n```python\nclass Singleton:\n    _instance = None\n    \n    def __new__(cls):\n        if cls._instance is None:\n            cls._instance = super().__new__(cls)\n        return cls._instance\n\n# Usage\ns1 = Singleton()\ns2 = Singleton()\nprint(s1 is s2)  # True\n```\n\n**Use Cases:**\n- Database connections\n- Configuration objects\n- Logging\n- Caching\n\n**Cons:**\n- Makes testing harder\n- Hidden dependencies\n- Violates Single Responsibility Principle\n\nConsider using dependency injection instead.",
    tags: ["design-patterns", "singleton", "oop"],
    createdAt: new Date("2024-11-20"),
    nextReviewAt: new Date(Date.now() + 345600000),
    reviewCount: 5,
    userId: "user-1",
    reviewHistory: [],
  },
  {
    id: "qa-43",
    question: "What is XSS (Cross-Site Scripting)?",
    answer: "XSS is an injection attack where malicious scripts are injected into trusted websites.\n\n**Types:**\n\n**1. Stored XSS:**\nMalicious script stored in database\n```html\n<script>/* steal cookies */</script>\n```\n\n**2. Reflected XSS:**\nScript in URL reflected in response\n```\nexample.com/search?q=<script>alert('XSS')</script>\n```\n\n**3. DOM-based XSS:**\nClient-side JavaScript vulnerability\n\n**Prevention:**\n1. **Escape output:** Convert `<` to `&lt;`\n2. **Content Security Policy (CSP)**\n3. **Input validation**\n4. **Use frameworks** (React escapes by default)\n5. **HTTPOnly cookies**\n6. **Sanitize HTML**\n\nNever use `innerHTML` with user input!",
    tags: ["security", "xss", "owasp"],
    createdAt: new Date("2024-11-25"),
    nextReviewAt: new Date(Date.now() + 86400000),
    reviewCount: 4,
    userId: "user-1",
    reviewHistory: [],
  },
  {
    id: "qa-44",
    question: "What is MongoDB and when to use it?",
    answer: "MongoDB is a NoSQL document database that stores data in flexible JSON-like documents.\n\n**Features:**\n- Schema-less (flexible structure)\n- Horizontal scaling (sharding)\n- Rich query language\n- Indexes for fast queries\n- Aggregation framework\n\n**Document Example:**\n```json\n{\n  \"_id\": \"507f1f77bcf86cd799439011\",\n  \"name\": \"John Doe\",\n  \"tags\": [\"developer\", \"mongodb\"],\n  \"address\": {\n    \"city\": \"New York\"\n  }\n}\n```\n\n**Use When:**\n- Rapidly evolving schema\n- Hierarchical data\n- High write loads\n- Horizontal scaling needed\n\n**Avoid When:**\n- Complex transactions required\n- Many joins needed\n- Strong consistency critical",
    tags: ["database", "mongodb", "nosql"],
    createdAt: new Date("2024-11-30"),
    nextReviewAt: new Date(Date.now() + 172800000),
    reviewCount: 6,
    userId: "user-1",
    reviewHistory: [],
  },
  {
    id: "qa-45",
    question: "What is webpack and what problem does it solve?",
    answer: "Webpack is a module bundler for JavaScript applications.\n\n**Problems it Solves:**\n1. **Module Management:** Bundles ES6 modules, CommonJS, AMD\n2. **Asset Bundling:** JS, CSS, images, fonts\n3. **Code Transformation:** Babel, TypeScript, SASS\n4. **Code Splitting:** Load code on demand\n5. **Tree Shaking:** Remove unused code\n6. **Dev Server:** Hot module replacement\n\n**Core Concepts:**\n- **Entry:** Starting point\n- **Output:** Bundled file location\n- **Loaders:** Transform files (babel-loader, css-loader)\n- **Plugins:** Optimize, minify, inject\n\n**Alternatives:** Vite, Rollup, Parcel, esbuild\n\nModern tools like Vite are faster for development.",
    tags: ["webpack", "build-tools", "frontend"],
    createdAt: new Date("2024-12-05"),
    nextReviewAt: new Date(Date.now() + 259200000),
    reviewCount: 3,
    userId: "user-1",
    reviewHistory: [],
  },
  {
    id: "qa-46",
    question: "What is the difference between `map()`, `filter()`, and `reduce()`?",
    answer: "All are array methods that don't mutate the original array.\n\n**map():** Transform each element\n```javascript\nconst doubled = [1, 2, 3].map(x => x * 2);\n// [2, 4, 6]\n```\n\n**filter():** Keep elements that pass a test\n```javascript\nconst evens = [1, 2, 3, 4].filter(x => x % 2 === 0);\n// [2, 4]\n```\n\n**reduce():** Reduce array to single value\n```javascript\nconst sum = [1, 2, 3, 4].reduce((acc, x) => acc + x, 0);\n// 10\n```\n\n**Chaining:**\n```javascript\nconst result = [1, 2, 3, 4]\n  .filter(x => x % 2 === 0)  // [2, 4]\n  .map(x => x * 2)           // [4, 8]\n  .reduce((a, b) => a + b)   // 12\n```",
    tags: ["javascript", "arrays", "functional-programming"],
    createdAt: new Date("2024-12-10"),
    nextReviewAt: new Date(Date.now() + 86400000),
    reviewCount: 8,
    userId: "user-1",
    reviewHistory: [],
  },
  {
    id: "qa-47",
    question: "What is semantic HTML and why is it important?",
    answer: "Semantic HTML uses meaningful tags that describe their content's purpose.\n\n**Semantic Tags:**\n```html\n<header>, <nav>, <main>, <article>, <section>\n<aside>, <footer>, <figure>, <figcaption>\n<time>, <mark>, <details>, <summary>\n```\n\n**vs Non-semantic:**\n```html\n<div>, <span>  <!-- No meaning -->\n```\n\n**Benefits:**\n\n1. **SEO:** Search engines understand content better\n2. **Accessibility:** Screen readers navigate easier\n3. **Maintainability:** Code is self-documenting\n4. **CSS/JS Targeting:** Better selectors\n\n**Example:**\n```html\n<!-- Good -->\n<article>\n  <h1>Title</h1>\n  <p>Content</p>\n</article>\n\n<!-- Bad -->\n<div class=\"article\">\n  <div class=\"title\">Title</div>\n  <div>Content</div>\n</div>\n```",
    tags: ["html", "semantic-html", "accessibility", "seo"],
    createdAt: new Date("2024-12-15"),
    nextReviewAt: new Date(Date.now() + 172800000),
    reviewCount: 4,
    userId: "user-1",
    reviewHistory: [],
  },
  {
    id: "qa-48",
    question: "What is Agile methodology?",
    answer: "Agile is an iterative approach to software development emphasizing flexibility and customer collaboration.\n\n**Core Values (Agile Manifesto):**\n- Individuals over processes\n- Working software over documentation\n- Customer collaboration over contracts\n- Responding to change over following a plan\n\n**Common Frameworks:**\n\n**Scrum:**\n- Sprints (1-4 weeks)\n- Daily standups\n- Sprint planning, review, retrospective\n- Roles: Product Owner, Scrum Master, Team\n\n**Kanban:**\n- Visual board (To Do, In Progress, Done)\n- Limit work in progress (WIP)\n- Continuous flow\n\n**Benefits:**\n- Faster feedback\n- Adaptability\n- Early delivery\n- Better quality",
    tags: ["agile", "scrum", "kanban", "methodology"],
    createdAt: new Date("2024-12-20"),
    nextReviewAt: new Date(Date.now() + 259200000),
    reviewCount: 2,
    userId: "user-1",
    reviewHistory: [],
  },
  {
    id: "qa-49",
    question: "What is recursion and when should you use it?",
    answer: "Recursion is when a function calls itself to solve a problem by breaking it into smaller subproblems.\n\n**Requirements:**\n1. **Base case:** Stopping condition\n2. **Recursive case:** Function calls itself with smaller input\n\n**Example:**\n```python\ndef factorial(n):\n    if n <= 1:           # Base case\n        return 1\n    return n * factorial(n - 1)  # Recursive case\n\nfactorial(5)  # 120\n```\n\n**Use When:**\n- Tree/graph traversal\n- Divide and conquer (merge sort, quick sort)\n- Mathematical sequences (Fibonacci)\n- Backtracking (N-Queens, Sudoku)\n\n**Cons:**\n- Stack overflow risk\n- Often slower than iteration\n- More memory usage\n\nConsider iteration or tail recursion optimization.",
    tags: ["algorithms", "recursion", "programming"],
    createdAt: new Date("2024-12-25"),
    nextReviewAt: new Date(Date.now() + 86400000),
    reviewCount: 6,
    userId: "user-1",
    reviewHistory: [],
  },
  {
    id: "qa-50",
    question: "What is the difference between unit tests, integration tests, and end-to-end tests?",
    answer: "**Unit Tests:**\n- Test individual functions/methods in isolation\n- Fast, many tests\n- Mock dependencies\n- Example: Test a single function\n\n**Integration Tests:**\n- Test how components work together\n- Medium speed, fewer tests\n- Test multiple modules\n- Example: Test API endpoint with database\n\n**E2E (End-to-End) Tests:**\n- Test entire application flow\n- Slow, fewest tests\n- Simulate real user behavior\n- Example: Login → Browse → Checkout\n\n**Testing Pyramid:**\n```\n    /\\  E2E (few, slow)\n   /  \\\n  / IT \\  Integration (some)\n /_Unit_\\ Unit (many, fast)\n```\n\n**Tools:**\n- Unit: Jest, pytest, JUnit\n- E2E: Cypress, Playwright, Selenium",
    tags: ["testing", "unit-tests", "integration-tests", "e2e"],
    createdAt: new Date("2024-12-30"),
    nextReviewAt: new Date(Date.now() + 172800000),
    reviewCount: 5,
    userId: "user-1",
    reviewHistory: [],
  },

  // Demo User QA Pairs (user-2)
  {
    id: "qa-demo-1",
    question: "What is the difference between margin and padding in CSS?",
    answer: "**Margin:**\n- Space OUTSIDE the element's border\n- Creates space between elements\n- Transparent (shows parent's background)\n- Can have negative values\n- Margins can collapse\n\n**Padding:**\n- Space INSIDE the element's border\n- Creates space between content and border\n- Shows element's background color\n- Cannot have negative values\n- Padding never collapses\n\n**Example:**\n```css\n.box {\n  margin: 20px;   /* Space outside */\n  padding: 10px;  /* Space inside */\n  border: 2px solid black;\n}\n```",
    tags: ["css", "layout", "basics"],
    createdAt: new Date("2025-01-05"),
    nextReviewAt: new Date(Date.now() - 3600000), // Due 1 hour ago
    reviewCount: 2,
    userId: "user-2",
    reviewHistory: [],
  },
  {
    id: "qa-demo-2",
    question: "Explain the box model in CSS",
    answer: "The CSS box model describes how elements are sized and spaced:\n\n**Components (from inside out):**\n1. **Content:** The actual content (text, images)\n2. **Padding:** Space around content\n3. **Border:** Line around padding\n4. **Margin:** Space outside border\n\n**Box Sizing:**\n```css\n/* Default: width = content only */\nbox-sizing: content-box;\n\n/* Better: width = content + padding + border */\nbox-sizing: border-box;\n```\n\nMost modern CSS uses `border-box` for predictable sizing.",
    tags: ["css", "box-model", "layout"],
    createdAt: new Date("2025-01-06"),
    nextReviewAt: new Date(Date.now() + 86400000), // Due tomorrow
    reviewCount: 1,
    userId: "user-2",
    reviewHistory: [],
  },
  {
    id: "qa-demo-3",
    question: "What is Flexbox and when should you use it?",
    answer: "Flexbox is a one-dimensional layout system for arranging items in rows or columns.\n\n**Key Properties:**\n```css\n.container {\n  display: flex;\n  flex-direction: row | column;\n  justify-content: center | space-between | flex-start;\n  align-items: center | stretch | flex-start;\n  gap: 10px;\n}\n\n.item {\n  flex: 1; /* Grow to fill space */\n  flex-shrink: 0; /* Don't shrink */\n}\n```\n\n**Use When:**\n- Centering items\n- Distributing space evenly\n- Creating navigation bars\n- Aligning items in a row/column\n\n**Don't use for:** Two-dimensional layouts (use Grid instead)",
    tags: ["css", "flexbox", "layout"],
    createdAt: new Date("2025-01-07"),
    nextReviewAt: new Date(Date.now() - 7200000), // Due 2 hours ago
    reviewCount: 3,
    userId: "user-2",
    reviewHistory: [],
  },
  {
    id: "qa-demo-4",
    question: "What is async/await in JavaScript?",
    answer: "`async/await` is syntactic sugar for working with Promises, making async code look synchronous.\n\n**Basic Syntax:**\n```javascript\n// Without async/await\nfetchData()\n  .then(data => processData(data))\n  .then(result => console.log(result))\n  .catch(error => console.error(error));\n\n// With async/await\nasync function getData() {\n  try {\n    const data = await fetchData();\n    const result = await processData(data);\n    console.log(result);\n  } catch (error) {\n    console.error(error);\n  }\n}\n```\n\n**Rules:**\n- `await` only works inside `async` functions\n- `async` functions always return a Promise\n- Use `try/catch` for error handling",
    tags: ["javascript", "async", "await"],
    createdAt: new Date("2025-01-08"),
    nextReviewAt: new Date(Date.now() + 172800000), // Due in 2 days
    reviewCount: 4,
    userId: "user-2",
    reviewHistory: [],
  },
  {
    id: "qa-demo-5",
    question: "What is the DOM?",
    answer: "The DOM (Document Object Model) is a programming interface for HTML and XML documents.\n\n**What it does:**\n- Represents the page as a tree of objects\n- Each HTML element is a node\n- JavaScript can manipulate these nodes\n\n**Example:**\n```javascript\n// Access elements\nconst element = document.getElementById('myDiv');\nconst elements = document.querySelectorAll('.myClass');\n\n// Modify elements\nelement.textContent = 'New text';\nelement.style.color = 'blue';\nelement.classList.add('active');\n\n// Create elements\nconst newDiv = document.createElement('div');\ndocument.body.appendChild(newDiv);\n```\n\n**DOM Tree:**\n```\nDocument\n  └─ html\n      ├─ head\n      └─ body\n          ├─ div\n          └─ p\n```",
    tags: ["javascript", "dom", "web"],
    createdAt: new Date("2025-01-08"),
    nextReviewAt: new Date(Date.now() - 1800000), // Due 30 min ago
    reviewCount: 2,
    userId: "user-2",
    reviewHistory: [],
  },
  {
    id: "qa-demo-6",
    question: "What is Git and why is it important?",
    answer: "Git is a distributed version control system for tracking changes in source code.\n\n**Key Features:**\n- **Version Control:** Track every change\n- **Branching:** Work on features in isolation\n- **Collaboration:** Multiple people work together\n- **Backup:** Code stored remotely (GitHub, GitLab)\n- **History:** See who changed what and when\n\n**Basic Commands:**\n```bash\ngit init              # Initialize repository\ngit add .             # Stage changes\ngit commit -m \"msg\"   # Save changes\ngit push              # Upload to remote\ngit pull              # Download updates\ngit branch feature    # Create branch\ngit checkout feature  # Switch branch\ngit merge feature     # Merge branch\n```\n\n**Why Important:**\n- Essential for professional development\n- Required for team collaboration\n- Industry standard",
    tags: ["git", "version-control", "tools"],
    createdAt: new Date("2025-01-09"),
    nextReviewAt: new Date(Date.now() + 86400000), // Due tomorrow
    reviewCount: 1,
    userId: "user-2",
    reviewHistory: [],
  },
  {
    id: "qa-demo-7",
    question: "What is the difference between GET and POST HTTP methods?",
    answer: "**GET:**\n- Retrieve data from server\n- Parameters in URL (visible)\n- Can be bookmarked\n- Cached by browsers\n- Limited data size (~2048 chars)\n- Idempotent (repeated calls have same effect)\n- Example: `GET /users?id=123`\n\n**POST:**\n- Send data to server\n- Parameters in request body (hidden)\n- Cannot be bookmarked\n- Not cached\n- No size limit\n- Not idempotent (creates new resources)\n- Example: `POST /users` with body `{name: \"John\"}`\n\n**Use Cases:**\n- GET: Fetching data, search queries\n- POST: Creating resources, submitting forms, uploading files",
    tags: ["http", "web", "api"],
    createdAt: new Date("2025-01-09"),
    nextReviewAt: new Date(Date.now() - 5400000), // Due 1.5 hours ago
    reviewCount: 3,
    userId: "user-2",
    reviewHistory: [],
  },
  {
    id: "qa-demo-8",
    question: "What is responsive web design?",
    answer: "Responsive web design makes websites adapt to different screen sizes and devices.\n\n**Key Techniques:**\n\n**1. Media Queries:**\n```css\n/* Mobile first */\n.container { width: 100%; }\n\n/* Tablet */\n@media (min-width: 768px) {\n  .container { width: 750px; }\n}\n\n/* Desktop */\n@media (min-width: 1024px) {\n  .container { width: 1000px; }\n}\n```\n\n**2. Flexible Grids:**\n```css\n.grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n}\n```\n\n**3. Flexible Images:**\n```css\nimg {\n  max-width: 100%;\n  height: auto;\n}\n```\n\n**4. Viewport Meta Tag:**\n```html\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n```",
    tags: ["css", "responsive", "mobile"],
    createdAt: new Date("2025-01-10"),
    nextReviewAt: new Date(Date.now() + 259200000), // Due in 3 days
    reviewCount: 1,
    userId: "user-2",
    reviewHistory: [],
  },
  {
    id: "qa-demo-9",
    question: "What is JSON?",
    answer: "JSON (JavaScript Object Notation) is a lightweight data interchange format.\n\n**Characteristics:**\n- Human-readable text format\n- Language-independent\n- Easy to parse and generate\n- Based on JavaScript object syntax\n\n**Syntax:**\n```json\n{\n  \"name\": \"John Doe\",\n  \"age\": 30,\n  \"isStudent\": false,\n  \"courses\": [\"Math\", \"Science\"],\n  \"address\": {\n    \"city\": \"New York\",\n    \"zip\": \"10001\"\n  }\n}\n```\n\n**Data Types:**\n- String: `\"text\"`\n- Number: `123`, `45.67`\n- Boolean: `true`, `false`\n- Array: `[1, 2, 3]`\n- Object: `{\"key\": \"value\"}`\n- null: `null`\n\n**JavaScript Usage:**\n```javascript\nconst obj = JSON.parse('{\"name\":\"John\"}'); // String → Object\nconst str = JSON.stringify({name: \"John\"}); // Object → String\n```",
    tags: ["json", "data-formats", "web"],
    createdAt: new Date("2025-01-10"),
    nextReviewAt: new Date(Date.now() - 10800000), // Due 3 hours ago
    reviewCount: 2,
    userId: "user-2",
    reviewHistory: [],
  },
  {
    id: "qa-demo-10",
    question: "What is an API?",
    answer: "API (Application Programming Interface) is a set of rules for how software components communicate.\n\n**Types:**\n\n**1. REST API:**\n- Uses HTTP methods (GET, POST, PUT, DELETE)\n- Stateless\n- Resource-based URLs\n```javascript\nGET    /api/users      // Get all users\nPOST   /api/users      // Create user\nGET    /api/users/123  // Get user by ID\nPUT    /api/users/123  // Update user\nDELETE /api/users/123  // Delete user\n```\n\n**2. GraphQL API:**\n- Single endpoint\n- Client specifies exactly what data needed\n\n**3. WebSocket API:**\n- Two-way real-time communication\n\n**Why Important:**\n- Enables integration between systems\n- Mobile apps communicate with servers\n- Third-party service integration (payment, maps, etc.)\n\n**Example:**\n```javascript\nfetch('https://api.example.com/users')\n  .then(res => res.json())\n  .then(data => console.log(data));\n```",
    tags: ["api", "web", "backend"],
    createdAt: new Date("2025-01-10"),
    nextReviewAt: new Date(Date.now() + 43200000), // Due in 12 hours
    reviewCount: 3,
    userId: "user-2",
    reviewHistory: [],
  },
  {
    id: "qa-demo-11",
    question: "What is localStorage vs sessionStorage?",
    answer: "Both are web storage APIs for storing data in the browser.\n\n**localStorage:**\n```javascript\n// Persists even after browser closes\nlocalStorage.setItem('theme', 'dark');\nconst theme = localStorage.getItem('theme');\nlocalStorage.removeItem('theme');\nlocalStorage.clear();\n```\n- Data persists until manually cleared\n- Available across all tabs\n- Size: ~5-10MB\n\n**sessionStorage:**\n```javascript\n// Clears when tab closes\nsessionStorage.setItem('tempData', 'value');\nconst data = sessionStorage.getItem('tempData');\n```\n- Data cleared when tab/window closes\n- Separate for each tab\n- Size: ~5-10MB\n\n**Use Cases:**\n- localStorage: User preferences, theme, cached data\n- sessionStorage: Form data, temporary state, wizard steps\n\n**Security:**\n- Both vulnerable to XSS attacks\n- Don't store sensitive data (passwords, tokens)\n- Use httpOnly cookies for sensitive data",
    tags: ["javascript", "storage", "web"],
    createdAt: new Date("2025-01-10"),
    nextReviewAt: new Date(Date.now() - 14400000), // Due 4 hours ago
    reviewCount: 4,
    userId: "user-2",
    reviewHistory: [],
  },
  {
    id: "qa-demo-12",
    question: "What is the difference between undefined and null?",
    answer: "Both represent absence of value, but with different meanings.\n\n**undefined:**\n- Variable declared but not assigned\n- Function parameter not provided\n- Object property doesn't exist\n- Function has no return statement\n- Type: `undefined`\n\n```javascript\nlet x;              // undefined\nfunction test() {}  \ntest();            // returns undefined\n\nconst obj = { a: 1 };\nobj.b;             // undefined\n\nfunction greet(name) {\n  console.log(name); // undefined if not passed\n}\ngreet();\n```\n\n**null:**\n- Intentional absence of value\n- Must be explicitly assigned\n- Represents \"no object\"\n- Type: `object` (JavaScript quirk)\n\n```javascript\nlet user = null;   // Explicitly no user\n```\n\n**Comparison:**\n```javascript\nundefined == null   // true (loose equality)\nundefined === null  // false (strict equality)\ntypeof undefined    // \"undefined\"\ntypeof null         // \"object\" (bug in JS)\n```",
    tags: ["javascript", "types", "basics"],
    createdAt: new Date("2025-01-10"),
    nextReviewAt: new Date(Date.now() + 518400000), // Due in 6 days
    reviewCount: 1,
    userId: "user-2",
    reviewHistory: [],
  },
  {
    id: "qa-demo-13",
    question: "What is the purpose of the package.json file?",
    answer: "package.json is the manifest file for Node.js projects.\n\n**Key Sections:**\n```json\n{\n  \"name\": \"my-app\",\n  \"version\": \"1.0.0\",\n  \"description\": \"My application\",\n  \"main\": \"index.js\",\n  \"scripts\": {\n    \"start\": \"node index.js\",\n    \"dev\": \"nodemon index.js\",\n    \"test\": \"jest\"\n  },\n  \"dependencies\": {\n    \"express\": \"^4.18.0\"\n  },\n  \"devDependencies\": {\n    \"nodemon\": \"^2.0.0\"\n  }\n}\n```\n\n**Purposes:**\n1. **Project Metadata:** Name, version, description\n2. **Dependencies:** List required packages\n3. **Scripts:** Define commands (`npm run dev`)\n4. **Entry Point:** Specify main file\n5. **Configuration:** Set project settings\n\n**Dependency Versions:**\n- `\"^1.2.3\"` - Compatible (1.x.x)\n- `\"~1.2.3\"` - Approximate (1.2.x)\n- `\"1.2.3\"` - Exact version\n\n**Commands:**\n```bash\nnpm install          # Install all dependencies\nnpm install express  # Add new dependency\nnpm run dev          # Run script\n```",
    tags: ["nodejs", "npm", "tools"],
    createdAt: new Date("2025-01-10"),
    nextReviewAt: new Date(Date.now() - 21600000), // Due 6 hours ago
    reviewCount: 2,
    userId: "user-2",
    reviewHistory: [],
  },
  {
    id: "qa-demo-14",
    question: "What is the difference between div and span?",
    answer: "Both are generic HTML containers, but differ in display behavior.\n\n**`<div>` (Division):**\n- **Block-level** element\n- Takes full width available\n- Starts on new line\n- Can contain block and inline elements\n- Use for: Sections, layouts, containers\n\n```html\n<div>This div takes full width</div>\n<div>This starts on a new line</div>\n```\n\n**`<span>` (Span):**\n- **Inline** element\n- Takes only necessary width\n- Stays on same line\n- Should only contain inline elements\n- Use for: Styling parts of text\n\n```html\n<p>This is <span style=\"color: red\">red text</span> inline.</p>\n```\n\n**Visual Difference:**\n```html\n<!-- Block: Each on new line -->\n<div>One</div><div>Two</div>\n\n<!-- Inline: Same line -->\n<span>One</span><span>Two</span>\n```\n\n**CSS Override:**\n```css\ndiv { display: inline; }  /* Make div inline */\nspan { display: block; }  /* Make span block */\n```",
    tags: ["html", "basics", "elements"],
    createdAt: new Date("2025-01-10"),
    nextReviewAt: new Date(Date.now() + 345600000), // Due in 4 days
    reviewCount: 3,
    userId: "user-2",
    reviewHistory: [],
  },
  {
    id: "qa-demo-15",
    question: "What is CRUD?",
    answer: "CRUD represents the four basic operations for persistent storage.\n\n**C - Create:**\n- Add new data\n- SQL: `INSERT INTO users (name) VALUES ('John')`\n- HTTP: `POST /api/users`\n- MongoDB: `db.users.insertOne({name: 'John'})`\n\n**R - Read:**\n- Retrieve/query data\n- SQL: `SELECT * FROM users WHERE id = 1`\n- HTTP: `GET /api/users/1`\n- MongoDB: `db.users.findOne({_id: 1})`\n\n**U - Update:**\n- Modify existing data\n- SQL: `UPDATE users SET name = 'Jane' WHERE id = 1`\n- HTTP: `PUT /api/users/1` or `PATCH /api/users/1`\n- MongoDB: `db.users.updateOne({_id: 1}, {$set: {name: 'Jane'}})`\n\n**D - Delete:**\n- Remove data\n- SQL: `DELETE FROM users WHERE id = 1`\n- HTTP: `DELETE /api/users/1`\n- MongoDB: `db.users.deleteOne({_id: 1})`\n\n**Example REST API:**\n```javascript\napp.get('/users', getAllUsers);        // Read all\napp.get('/users/:id', getUser);        // Read one\napp.post('/users', createUser);        // Create\napp.put('/users/:id', updateUser);     // Update\napp.delete('/users/:id', deleteUser);  // Delete\n```",
    tags: ["database", "api", "crud"],
    createdAt: new Date("2025-01-10"),
    nextReviewAt: new Date(Date.now() - 28800000), // Due 8 hours ago
    reviewCount: 5,
    userId: "user-2",
    reviewHistory: [],
  },
]

// Mock dashboard stats
export function getDashboardStats(userId: string): DashboardStats {
  const userQAPairs = mockQAPairs.filter(qa => qa.userId === userId)
  const dueQAPairs = userQAPairs.filter(qa => new Date(qa.nextReviewAt) <= new Date())
  
  const totalReviews = userQAPairs.reduce((sum, qa) => sum + qa.reviewCount, 0)
  
  // Generate activity data for the last 90 days
  const activityData = []
  const today = new Date()
  
  for (let i = 89; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    
    // Simulate varying activity levels
    const dayOfWeek = date.getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
    const baseCount = isWeekend ? Math.floor(Math.random() * 3) : Math.floor(Math.random() * 8)
    
    activityData.push({
      date: date.toISOString().split('T')[0],
      count: baseCount,
    })
  }
  
  return {
    totalQAPairs: userQAPairs.length,
    reviewsDueToday: dueQAPairs.length,
    totalReviewsCompleted: totalReviews,
    averageAccuracy: 85.5,
    dayStreak: 7,
    activityData,
  }
}

// Mock authentication storage
export const mockAuth = {
  users: mockUsers,
  currentUser: null as User | null,
  
  login(email: string, password: string): User | null {
    // Simple mock authentication - in real app, verify password hash
    const user = this.users.find(u => u.email === email)
    if (user) {
      this.currentUser = user
      return user
    }
    return null
  },
  
  logout() {
    this.currentUser = null
  },
  
  getCurrentUser(): User | null {
    return this.currentUser
  },
}
