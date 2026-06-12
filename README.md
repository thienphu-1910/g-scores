# G-SCORES

A modern, full-stack web application designed for high performance and scalability. This project utilizes a React frontend paired with a robust Express backend, leveraging Redis and BullMQ for reliable background job processing, and Prisma ORM for type-safe database interactions.

## 🚀 Tech Stack

### Frontend
* **Core:** ReactJS, React Router DOM
* **Styling:** TailwindCSS
* **State Management:** Zustand
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
VITE_BASE_URL=http://localhost:3000/api

```

**Install and Run:**

```bash
npm install
npm run dev

```

## Workflows

### 1. Synchronous Workload: Score Retrieval (Search Scores)

This is a standard, low-latency Request-Response cycle designed for quick data fetching.

* **Request Initiation:** The user inputs a Registration Number on the frontend client, which triggers an HTTP `GET` request to the Express.js server.
* **Database Query:** The server's controller receives the request and utilizes the Prisma ORM to execute a read query against the primary database (e.g., PostgreSQL).
* **Response Delivery:** Once Prisma resolves the query, the backend formats the data and returns a synchronous JSON response back to the client to render the score.

**Architectural Characteristic:** This flow is synchronous and blocking only at the database I/O level. It relies on database indexing on the Registration Number for optimal query performance.

### 2. Asynchronous Workload: Report Generation

This workload handles computationally expensive or time-consuming operations by decoupling the request from the processing using a message queue, caching, and an event-driven response mechanism.

* **Request & Cache Verification:** The user selects target subjects for the report. The client sends this payload to the server. Before performing any calculations, the server queries the Redis cache using a unique hash of the requested parameters to check for existing, pre-calculated data.
* *Cache Hit:* If the data exists, it is immediately returned to the client, bypassing all subsequent steps.
* *Cache Miss:* If the data does not exist, the server proceeds to the queuing phase.


* **Job Queuing:** The server acts as a Producer, enqueuing a new job containing the requested subject parameters into BullMQ. The server then immediately opens a Server-Sent Events (SSE) connection with the client, keeping the channel alive without blocking the main Node.js event loop.
* **Background Processing:** A dedicated background Worker process (consuming from BullMQ) picks up the job. It performs the heavy data aggregation and mathematical calculations required for the report.
* **State Persistence & Event Dispatch:** Upon completing the calculation, the Worker saves the final report data back into the Redis cache (with an appropriate Time-To-Live expiration) to serve future identical requests.
* **Real-time Delivery:** The backend, listening for the job completion event from BullMQ, pushes the generated report data down the established SSE pipeline to the waiting client, which then closes the connection and renders the visualization.

**Architectural Characteristic:** By offloading the heavy calculations to a BullMQ worker, the main API server remains highly responsive and capable of handling thousands of concurrent requests. The integration of Redis prevents redundant processing, and SSE provides a seamless, unidirectional real-time user experience without the overhead of WebSockets or client-side polling.
