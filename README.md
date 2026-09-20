# 🛠️ HostelFix — Agentic Complaint Triage for Hostels & PGs

> **AWS Hackathon — "Build It" Track (100% Open Source & Zero AWS Cost)**  
> An agentic maintenance triage engine that transforms messy, plain-language student complaints into structured, prioritized, and actionable maintenance workflows in real time.

---

## 📌 Problem Statement

In hostels and Paying Guest (PG) accommodations, maintenance complaints—such as leaking taps, broken doors, electrical faults, and Wi-Fi outages—are buried in noisy, scattered WhatsApp groups or verbal reports.

* **No prioritization:** Emergency issues (e.g., severe water leaks or exposed wiring) get lost alongside minor requests.
* **No structured routing:** Wardens and maintenance staff waste time deciphering unstructured messages and determining who should handle what.
* **Zero visibility:** Students are left in the dark with no status updates on their requests.

---

## 💡 Solution

**HostelFix** introduces an agentic 3-step triage workflow powered by an open-source AI gateway (**OmniRoute**). A student submits a complaint in natural language, and the AI agent processes and streams its reasoning live on screen via **Server-Sent Events (SSE)** across three distinct steps:

1. **🏷️ Classify:** Analyzes category (`Plumbing`, `Electrical`, `Internet`, `Structural`, `Other`) and assigns an urgency level (`Low`, `Medium`, `High`, `Emergency`).
2. **🔀 Route:** Automatically determines the correct handler (`Plumber`, `Electrician`, `IT Support`, `Warden`).
3. **📝 Draft:** Generates a concise, ready-to-send notification message containing the room number, issue details, and urgency.

---

## 🏗️ System Architecture

```
                       +-----------------------------------+
                       |    React (Vite) + Tailwind UI     |
                       |  (Student Form & Warden Dashboard)|
                       +-----------------+-----------------+
                                         |
                                         |  POST /api/complaints/triage
                                         |  (Server-Sent Events Stream)
                                         v
                       +-----------------------------------+
                       |       Express.js on Bun           |
                       |      (TypeScript Backend)         |
                       +--------+-----------------+--------+
                                |                 |
         Structured Prompting   |                 | Database Persistence
         & Agent Tool Calls     v                 v
          +-----------------------+     +-------------------+
          |  OmniRoute AI Gateway |     |  Prisma ORM       |
          |  (OpenAI SDK Endpoint)|     |  (PostgreSQL DB)  |
          +-----------+-----------+     +---------+---------+
                      |                           |
                      v                           v
          +-----------------------+     +-------------------+
          | Gemini Free / Ollama  |     | Docker Compose    |
          |   (LLM Providers)     |     | (Postgres +       |
          +-----------------------+     |  LocalStack)      |
                                        +-------------------+
```

---

## ⚡ Tech Stack

* **Frontend:** React 18, TypeScript, Tailwind CSS, Lucide React (Icons)
* **Backend:** Express.js running on the **Bun** runtime, TypeScript
* **Database & ORM:** PostgreSQL, Prisma ORM
* **AI Agent Gateway:** [OmniRoute](https://github.com/omniroute) using the `openai` SDK (`gemini-2.0-flash` / open-source models)
* **Real-time Communication:** Server-Sent Events (SSE)
* **Local Infrastructure:** Docker Compose, LocalStack (AWS mock)

---

## ✨ Key Features

* **⚡ Real-Time Visible Reasoning:** Students watch the agent "think" through Classify $\rightarrow$ Route $\rightarrow$ Draft steps in real time.
* **📋 Warden Dashboard:** Centralized complaint queue grouped automatically by urgency and routing category.
* **🚀 One-Click Dispatch:** Wardens can copy or send pre-drafted technician notifications directly from the dashboard.
* **💸 $0 Infrastructure Cost:** Configured entirely for local development using open-source tools and free-tier models.

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:

* [Bun](https://bun.sh/) (v1.0+)
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) or Finch
* [OmniRoute CLI](https://github.com/omniroute)

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/hostelfix.git
cd hostelfix
```

### 2. Configure Environment Variables

Create a `.env` file in the project root:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/hostelfix?schema=public"

# Server
PORT=3000

# OmniRoute Gateway Configuration
OMNIROUTE_BASE_URL="http://localhost:3000/v1"
OMNIROUTE_API_KEY="omniroute"
```

### 3. Start Local Infrastructure

Spin up PostgreSQL and LocalStack using Docker Compose:

```bash
docker compose up -d
```

### 4. Install Dependencies & Run Database Migrations

```bash
bun install
bunx prisma migrate dev --name init
```

### 5. Start OmniRoute Gateway

In a separate terminal, launch OmniRoute with your preferred free API key (e.g., Gemini Free API key):

```bash
npx omniroute
```

### 6. Start the Development Server

```bash
bun run dev
```

Open your browser and navigate to `http://localhost:5173` to launch HostelFix.

---

## 🧪 Example Triage Walkthrough

1. **Student Input:**
   > *"The tap in room 214 has been leaking heavily for two days and water is starting to flood the floor."*

2. **Agent Live Triage Stream:**
   * **[Step 1 - Classify]** Category: `Plumbing` | Urgency: `Emergency`
   * **[Step 2 - Route]** Assigned To: `On-Duty Plumber`
   * **[Step 3 - Draft]** *"EMERGENCY [Room 214]: Heavy tap leakage ongoing for 2 days causing flooding. Immediate plumbing attention required."*
