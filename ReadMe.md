# ⚡ Page Pulse — Web Audit & Instant Health Inspector Engine

> **Developer SEO Assistant & Real-Time Performance Inspector**  
> Built for the **Digital Heroes** Training Task.

Page Pulse is an enterprise-grade web audit engine designed to perform real-time health checks, performance analysis, and technical SEO evaluations of target URLs. Built with a **FastAPI (Python)** backend and a **React (Vite + TypeScript)** frontend, it provides automated rule inspection, SSRF protection, caching, and actionable fix recommendations.

---

## 🛠️ Key Architectural Features

- **SSRF Protection & URL Validation:** Sanitizes and validates inbound target URLs against internal/private IP ranges and dangerous protocols.
- **In-Memory TTL Caching & SQLite Persistence:** Caches recent audit reports to reduce network overhead while persisting audit history in SQLite.
- **Multi-Rule Evaluation Engine:** Inspects HTTP status, response latency, DOM headers, meta tags, and accessibility indicators.
- **Interactive Fix Simulator:** Real-time score recalculation allowing users to preview potential score gains by toggling recommended fixes.
- **PDF & JSON Report Export:** Generate structured client-ready reports or download raw inspection JSON files.

---

## 📂 Project Directory Structure

```text
page-pulse/
├── backend/
│   ├── app/
│   │   ├── core/           # SSRF validation, security guards, caching logic
│   │   ├── db/             # SQLite database models & persistence
│   │   ├── services/       # Evaluator engines and inspection rules
│   │   └── main.py         # FastAPI application entrypoint & endpoints
│   ├── requirements.txt    # Backend Python dependencies
│   └── test_audit.py       # Pytest unit & integration tests
├── frontend/
│   ├── src/
│   │   ├── components/     # React UI components (Gauge, Tables, ActionItems)
│   │   ├── services/       # API integration client
│   │   ├── types/          # TypeScript interfaces & definitions
│   │   ├── App.tsx         # Root React application
│   │   └── main.tsx        # Application mount entrypoint
│   ├── package.json        # Frontend Node dependencies & scripts
│   └── vite.config.ts      # Vite dev server configuration
└── README.md

🚀 Getting Started (Local Development)
Prerequisites
Python: v3.10+

Node.js: v18.0+

npm: v9.0+


1️⃣ Backend Setup (FastAPI)
Open a terminal and navigate to the backend folder:

Bash
cd backend

Create and activate a Python virtual environment:

Bash
# Windows (PowerShell)
python -m venv venv
.\venv\Scripts\Activate.ps1

# Linux / macOS
python3 -m venv venv
source venv/bin/activate


Install required dependencies:

Bash
pip install -r requirements.txt


Start the FastAPI development server on port 8000:

Bash
uvicorn app.main:app --reload --port 8000
Verify backend status by opening http://127.0.0.1:8000 in your browser.

2️⃣ Frontend Setup (React + Vite)
Open a second terminal window and navigate to the frontend folder:

Bash
cd frontend
Install Node modules:

Bash
npm install
Start the Vite development server:

Bash
npm run dev
Open http://localhost:3000 in your browser. The connection status badge will automatically turn FastAPI Connected.

🧪 Running Tests
To run the backend test suite (unit tests and endpoint integration checks):

Bash
cd backend
.\venv\Scripts\python.exe -m pytest
📡 API Endpoint Specifications
GET /
Description: Health check ping endpoint to verify backend status.

Response Example:

JSON
{
  "status": "online",
  "system": "Page Pulse Audit Engine v3.1",
  "architecture": "Plugin-Based Rule Engine"
}
GET /api/audit?url={target_url}
Description: Initiates a live security, performance, and SEO audit on the target web page.

Parameters: url (string, required) — Absolute HTTP/HTTPS URL.

Error Codes:

400 Bad Request: Invalid or unsafe URL parameter, non-HTML MIME type, or invalid response.

504 Gateway Timeout: Target server failed to respond within 10 seconds.

GET /api/history
Description: Fetches historical audit records stored in the SQLite database.

🌐 Production Live Deployment
Frontend Hosting: Deployed on Vercel / Netlify

Backend Hosting: Deployed on Render / Railway

Environment Variable Configuration:

VITE_API_BASE_URL = https://<your-backend-render-url>.onrender.com

🔗 Footer Compliance Link
This project is built and submitted for Digital Heroes Training Task.