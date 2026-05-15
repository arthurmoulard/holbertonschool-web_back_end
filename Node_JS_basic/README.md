# Node.js & Express.js — Learning Objectives

## 1. Run JavaScript using Node.js

**Node.js** is a JavaScript runtime built on Chrome's V8 engine that lets you run JavaScript outside the browser — on your machine or a server.

### Install & check version

```bash
node --version   # e.g. v20.11.0
npm --version
```

### Run a file

```bash
node app.js
```

### Run code directly in the REPL

```bash
node
> console.log('Hello, Node!')
Hello, Node!
```

### A minimal script

```javascript
// hello.js
console.log('Hello from Node.js!');
console.log(`Running Node ${process.version}`);
```

```bash
node hello.js
# Hello from Node.js!
# Running Node v20.11.0
```

---

## 2. Use Node.js modules

Node.js uses the **CommonJS** module system by default. Each file is its own module.

### Export

```javascript
// math.js
const add = (a, b) => a + b;
const multiply = (a, b) => a * b;

module.exports = { add, multiply };
```

### Import with `require`

```javascript
// app.js
const { add, multiply } = require('./math');

console.log(add(2, 3));       // 5
console.log(multiply(4, 5));  // 20
```

### ES Modules (ESM) syntax

With `.mjs` extension or `"type": "module"` in `package.json`:

```javascript
// math.mjs
export const add = (a, b) => a + b;

// app.mjs
import { add } from './math.mjs';
```

> Built-in modules are required without a path: `require('fs')`, `require('path')`, etc.

---

## 3. Use the `fs` module to read files

The built-in `fs` (File System) module provides methods to interact with the file system.

### Read a file asynchronously (recommended)

```javascript
const fs = require('fs');

fs.readFile('data.txt', 'utf8', (err, content) => {
  if (err) {
    console.error('Error reading file:', err.message);
    return;
  }
  console.log(content);
});
```

### Read a file with Promises (`fs/promises`)

```javascript
const fs = require('fs/promises');

async function readData() {
  try {
    const content = await fs.readFile('data.txt', 'utf8');
    console.log(content);
  } catch (err) {
    console.error('Error:', err.message);
  }
}

readData();
```

### Read a file synchronously (blocks execution)

```javascript
const fs = require('fs');

try {
  const content = fs.readFileSync('data.txt', 'utf8');
  console.log(content);
} catch (err) {
  console.error('Error:', err.message);
}
```

> Prefer **async** versions in servers to avoid blocking the event loop.

### Other common `fs` methods

```javascript
fs.writeFile('output.txt', 'Hello!', 'utf8', callback);  // write
fs.appendFile('log.txt', 'new line\n', callback);         // append
fs.unlink('file.txt', callback);                          // delete
fs.readdir('./folder', callback);                         // list directory
```

---

## 4. Use `process` to access command line arguments and the environment

The global `process` object gives access to the current Node.js process.

### Command line arguments — `process.argv`

`process.argv` is an array:
- `[0]` → path to `node`
- `[1]` → path to the script
- `[2+]` → your arguments

```javascript
// args.js
const args = process.argv.slice(2); // skip node + script path
console.log('Arguments:', args);
```

```bash
node args.js hello world 42
# Arguments: [ 'hello', 'world', '42' ]
```

### Environment variables — `process.env`

```javascript
// config.js
const port = process.env.PORT || 3000;
const env  = process.env.NODE_ENV || 'development';

console.log(`Running on port ${port} in ${env} mode`);
```

```bash
PORT=8080 NODE_ENV=production node config.js
# Running on port 8080 in production mode
```

> Use a `.env` file with the [`dotenv`](https://www.npmjs.com/package/dotenv) package to manage environment variables locally.

### Other useful `process` properties

```javascript
process.exit(0);        // exit with success code
process.exit(1);        // exit with error code
process.cwd();          // current working directory
process.pid;            // process ID
process.platform;       // 'linux', 'darwin', 'win32'
process.version;        // Node.js version string
```

---

## 5. Create a small HTTP server using Node.js

The built-in `http` module lets you create a web server with no external dependencies.

```javascript
// server.js
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello, World!\n');
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
```

```bash
node server.js
# Server running at http://localhost:3000
```

### Handling routes manually

```javascript
const http = require('http');

const server = http.createServer((req, res) => {
  if (req.url === '/' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Home page');
  } else if (req.url === '/about' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('About page');
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
});

server.listen(3000);
```

> The raw `http` module works, but becomes verbose with many routes — that's where Express comes in.

---

## 6. Create a small HTTP server using Express.js

**Express** is a minimal web framework for Node.js that simplifies routing, middleware, and request handling.

### Install

```bash
npm init -y
npm install express
```

### Basic server

```javascript
// app.js
const express = require('express');
const app = express();

app.use(express.json()); // parse JSON request bodies

app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

app.listen(3000, () => {
  console.log('Express server running at http://localhost:3000');
});
```

### Common response methods

```javascript
res.send('text');              // send plain text or HTML
res.json({ key: 'value' });   // send JSON
res.status(404).send('Not Found');
res.redirect('/new-url');
res.sendFile('/path/to/file');
```

---

## 7. Create advanced routes with Express.js

### Route parameters

```javascript
app.get('/users/:id', (req, res) => {
  const { id } = req.params;
  res.json({ userId: id });
});
// GET /users/42 → { userId: '42' }
```

### Query strings

```javascript
app.get('/search', (req, res) => {
  const { q, page = 1 } = req.query;
  res.json({ query: q, page });
});
// GET /search?q=node&page=2 → { query: 'node', page: '2' }
```

### Multiple HTTP methods

```javascript
app.get('/users',     (req, res) => res.json({ action: 'list users' }));
app.post('/users',    (req, res) => res.json({ action: 'create user', body: req.body }));
app.put('/users/:id', (req, res) => res.json({ action: 'update user', id: req.params.id }));
app.delete('/users/:id', (req, res) => res.json({ action: 'delete user', id: req.params.id }));
```

### Router — organize routes in separate files

```javascript
// routes/users.js
const { Router } = require('express');
const router = Router();

router.get('/', (req, res) => res.json({ users: [] }));
router.get('/:id', (req, res) => res.json({ id: req.params.id }));
router.post('/', (req, res) => res.status(201).json({ created: true }));

module.exports = router;
```

```javascript
// app.js
const usersRouter = require('./routes/users');
app.use('/users', usersRouter);
// → GET /users, GET /users/:id, POST /users
```

### Middleware

```javascript
// Global middleware (runs on every request)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next(); // pass control to the next handler
});

// Route-specific middleware
const authGuard = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

app.get('/protected', authGuard, (req, res) => {
  res.json({ secret: 'data' });
});
```

---

## 8. Use ES6 with Node.js using Babel-node

By default, older Node versions don't support all ES6+ syntax (like `import/export`). **Babel** transpiles modern JS to compatible code.

### Install

```bash
npm install --save-dev @babel/core @babel/node @babel/preset-env
```

### Configure Babel

```json
// .babelrc
{
  "presets": ["@babel/preset-env"]
}
```

### Use ES6 syntax freely

```javascript
// app.js
import express from 'express';
import { readFile } from 'fs/promises';

const app = express();

export const greet = (name) => `Hello, ${name}!`;

app.get('/', async (req, res) => {
  const data = await readFile('data.txt', 'utf8');
  res.send(data);
});

app.listen(3000);
```

### Run with `babel-node`

```bash
npx babel-node app.js
```

### Add a script in `package.json`

```json
{
  "scripts": {
    "start": "babel-node app.js"
  }
}
```

```bash
npm start
```

> `babel-node` is intended for **development only**. For production, pre-compile with `babel` to plain JS.

---

## 9. Use Nodemon to develop faster

**Nodemon** watches your files and automatically **restarts the server** whenever you save a change — no more manual `Ctrl+C` + `node app.js`.

### Install

```bash
npm install --save-dev nodemon
```

### Run with Nodemon

```bash
npx nodemon app.js
```

### Combine with Babel

```bash
npx nodemon --exec babel-node app.js
```

### Add scripts to `package.json`

```json
{
  "scripts": {
    "start": "babel-node app.js",
    "dev": "nodemon --exec babel-node app.js"
  }
}
```

```bash
npm run dev
```

Now every time you save a `.js` file, the server restarts automatically.

### Nodemon config (optional)

```json
// nodemon.json
{
  "exec": "babel-node",
  "ext": "js,json",
  "ignore": ["node_modules/", "dist/"]
}
```

---

## Quick Reference

```bash
# Run a script
node app.js

# Access CLI args
process.argv.slice(2)

# Access env variables
process.env.PORT

# Read a file
fs.readFile('file.txt', 'utf8', callback)
await fs.readFile('file.txt', 'utf8')   # with fs/promises

# Native HTTP server
http.createServer((req, res) => { ... }).listen(3000)

# Express server
npm install express
const app = express()
app.get('/route', (req, res) => res.json({ ... }))
app.listen(3000)

# Route params & query
req.params.id        # /users/:id
req.query.search     # /search?search=node
req.body             # POST body (needs express.json())

# Babel (ES6 support)
npm install --save-dev @babel/core @babel/node @babel/preset-env
npx babel-node app.js

# Nodemon (auto-restart)
npm install --save-dev nodemon
npx nodemon --exec babel-node app.js
```
