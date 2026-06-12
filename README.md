# G-SCORES

A modern, full-stack web application designed for high performance and scalability. This project utilizes a React frontend paired with a robust Express backend, leveraging Redis and BullMQ for reliable background job processing, and Prisma ORM for type-safe database interactions.

## Deployment
**Deployed Live Application:** [G-Scores](https://g-scores-pearl.vercel.app/)

## 🚀 Tech Stack

### Frontend
* **Core:** ReactJS, React Router DOM
* **Styling:** TailwindCSS
* **Forms & Validation:** React Hook Form
* **API Client:** Axios
* **Data Visualization:** Chart.js

### Backend
* **Core:** Express.js, Node.js
* **Language:** TypeScript
* **Database & ORM:** Prisma ORM
* **Caching & Message Queue:** Redis, BullMQ
* **Validation:** Zod

## 🛠 Prerequisites

Before starting, ensure you have the following ready:
* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* [Git](https://git-scm.com/)
* A target database (e.g., PostgreSQL) for Prisma to connect to
* A Redis instance

## ⚙️ Getting Started

Follow these instructions to set up the application environment locally.

### 1. Clone the Repository

```bash
git clone https://github.com/thienphu-1910/g-scores.git
cd g-scores

```

*(Note: Ensure your working directory matches the cloned folder name, e.g., `g-scores` or `g-stores`)*

### 2. Backend Setup

Open a terminal, navigate to your backend directory, and configure the database and background workers:

```bash
cd backend

```

**Database Configuration (Prisma):**

1. Access your Prisma Data Platform console (or local database client).
2. Create a new database project.
3. Run the Prisma initialization/pull command provided by the console within your backend folder to sync the schema.

**Migration and Seeder:**
1. Migration
```bash
npx prisma migrate dev
```
2. Seeding
```bash
npx prisma db seed
```

**Redis Configuration:**

1. Provision a new Redis database.
2. Create a `.env` file in the backend root directory.
3. Connect to the database via `node-redis` by adding your credentials. Ensure these map correctly to your `config/redis.ts` file:
```env
REDIS_USERNAME=your_username
REDIS_PASSWORD=your_password
REDIS_SOCKET_HOST=your_socket_host
REDIS_PORT=your_socket_port

```



**Install and Run:**

```bash
npm install
npm run dev

```

### 3. Frontend Setup

Open a new terminal instance, navigate to the frontend directory, and set up the client-side environment:

```bash
cd frontend

```

**Environment Variables:**
Create a `.env` file in the frontend root and map your API target:

```env
VITE_BASE_URL=<your_url>/api

```

**Install and Run:**

```bash
npm install
npm run dev

```

## Workflows

## 🏗 Architecture & Data Flow

This service utilizes an event-driven, decoupled architecture to handle intensive calculations without blocking the main Node.js event loop. Background processing is managed by **BullMQ**, real-time client updates are streamed via **Server-Sent Events (SSE)**, and inter-process communication relies on **Redis Pub/Sub**.

### 📊 Subject Reports Generation

*Calculates score distributions (Excellent, Good, Average, Poor) across large datasets.*

1. **Trigger:** The client submits an array of subject codes via a `POST` request. The API enqueues a `generate-report` job in BullMQ and immediately returns a `202 Accepted` response.
2. **Subscribe:** The client opens an SSE connection (`GET /stream-reports`). The backend attaches a dedicated Redis subscriber to listen for completion events.
3. **Process:** An isolated BullMQ Worker processes the job, aggregates the data via Prisma, and saves the result to the Redis store.
4. **Broadcast & Stream:** The worker publishes the result to a shared Redis channel. The SSE endpoint intercepts the message and streams the calculated distribution back to the client in real-time.

---

### 🏆 Top Scorers Leaderboard

*Aggregates and ranks the top 10 candidates across dynamic, user-defined subject groups.*

1. **Trigger & Deterministic Caching:** The client requests a leaderboard for a specific group. The backend generates a deterministic, sorted cache key (e.g., `top-chemistry_math_physics`) to ensure identical combinations share the same cache.
2. **Cache Evaluation:**
* **Cache Hit:** If the data exists in Redis, it is immediately streamed to the client via SSE, bypassing the worker entirely.
* **Cache Miss:** If missing, a job is queued in BullMQ, and the SSE endpoint subscribes to the worker's broadcast channel.


3. **Idempotent Processing:** The worker verifies the cache hasn't been filled by a concurrent process, calculates the top 10 sums, and caches the final payload.
4. **Broadcast & Stream:** The worker publishes the payload, the SSE endpoint catches it, streams the top 10 leaderboard to the client, and safely closes the connection.
