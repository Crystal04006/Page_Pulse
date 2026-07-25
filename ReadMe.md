Here is a clean, professional, and well-structured `README.md` tailored specifically for **Page Pulse** that satisfies all three requirements.

You can copy and paste this directly into your `README.md` file in the root of your project repository.

---

```markdown
# ⚡ Page Pulse — Developer SEO Assistant & Web Health Inspector

Page Pulse is an automated web health inspector and developer-centric SEO engine. Built with a **React (Vite) + TypeScript** frontend and a **FastAPI** backend, it parses web resources, evaluates SEO/performance metrics against custom rule engines, and delivers structured diagnostic feedback with actionable fix code snippets.

---

## 🚀 Live Demo & Links

* **Live Frontend App:** [https://page-pulse-plum.vercel.app](https://page-pulse-plum.vercel.app)
* **Backend API:** [https://page-pulse-dfwl.onrender.com](https://page-pulse-dfwl.onrender.com)
* **Repository:** [https://github.com/Crystal0406/Page_Pulse](https://github.com/Crystal0406/Page_Pulse)

---

## 🛠️ Local Setup & Installation

### Prerequisites
* **Node.js:** v18+ 
* **Python:** 3.10+
* **Git**

---

### 1. Backend Setup (FastAPI)

```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the FastAPI server locally
uvicorn app.main:app --reload --port 8000

```

> The API server will be available at `http://127.0.0.1:8000`.

---

### 2. Frontend Setup (React + Vite)

```bash
# Navigate to frontend directory
cd ../frontend

# Install node dependencies
npm install

# Create local environment configuration
echo "VITE_API_BASE_URL=[http://127.0.0.1:8000/api](http://127.0.0.1:8000/api)" > .env.local

# Start development server
npm run dev

```

> The UI will open at `http://localhost:5173`.

---

### 3. Running Test Suites

To execute the backend unit tests and rule engine verifications:

```bash
cd backend
pytest

```

---

## 📡 API Contract

### `GET /`

**Description:** Health check endpoint to confirm backend engine status.

**Response:** `200 OK`

```json
{
  "status": "online",
  "system": "Page Pulse Audit Engine v3.1",
  "architecture": "Plugin-Based Rule Engine"
}

```

---

### `GET /api/audit`

**Description:** Executes a live website health audit for a target URL.

**Query Parameters:**

* `url` *(string, required)*: Fully qualified web target (e.g., `https://dev.to`).

**Response (`200 OK`):**

```json
{
  "id": "audit-1721950000",
  "url": "[https://dev.to](https://dev.to)",
  "timestamp": "2026-07-26T00:30:00Z",
  "health_score": 85,
  "metrics": {
    "status_code": 200,
    "response_time_ms": 320,
    "h1_count": 1,
    "h2_count": 5,
    "meta_title": "DEV Community",
    "meta_description": "A constructive and inclusive social network for software developers.",
    "og_image": "[https://dev.to/og.png](https://dev.to/og.png)",
    "mobile_responsive": true,
    "ssl_active": true,
    "page_size_kb": 850,
    "images_missing_alt": 2,
    "total_images": 12,
    "canonical_url": "[https://dev.to/](https://dev.to/)",
    "has_robots_txt": true,
    "has_sitemap": true
  },
  "issues": [
    {
      "id": "iss-1",
      "rule_id": "rule_missing_alt",
      "title": "Images Missing Alt Text",
      "severity": "warning",
      "category": "accessibility",
      "predicted_priority": 1,
      "estimated_score_gain": 5,
      "estimated_fix_time": "5 mins",
      "business_impact": "Reduces screen reader accessibility and image search indexation.",
      "location_context": "2 <img> tags missing alt attributes.",
      "suggested_fix": {
        "html": "<img src=\"logo.png\" alt=\"Descriptive image text\">",
        "react": "<img src={logo} alt=\"Descriptive image text\" />"
      }
    }
  ]
}

```

**Error Responses:**

* `400 Bad Request`: Invalid URL format or unsafe request target.
* `422 Unprocessable Entity`: Missing required query parameter.
* `502 Bad Gateway`: Target domain unreachable or connection timeout.

---

### `GET /api/history`

**Description:** Fetches historical audit logs from persistent storage.

**Query Parameters:** `url` *(string, optional)*

**Response (`200 OK`):**

```json
{
  "history": [
    {
      "id": "audit-1721950000",
      "url": "[https://dev.to](https://dev.to)",
      "timestamp": "2026-07-26T00:30:00Z",
      "health_score": 85
    }
  ]
}

```

---

## 🏛️ Key Design Decisions & Reasoning

### 1. Hybrid Client/Server Fallback Engine

* **Decision:** Built a client-side mock audit generator that seamlessly steps in if the live FastAPI backend is unreachable or undergoing a cold start.
* **Reasoning:** On free deployment tiers like Render, backend services spin down after inactivity, causing latency spikes for initial requests. The client fallback prevents UI breakdown, guaranteeing a smooth, uninterrupted user experience for evaluators while real network fetches initialize in the background.

---

### 2. SSRF (Server-Side Request Forgery) Security Filtering

* **Decision:** Implemented input validation and IP resolution checks in FastAPI before making outbound HTTP requests to user-supplied URLs.
* **Reasoning:** Allowing a backend server to query arbitrary user URLs opens critical security risks, such as scanning local network interfaces (`localhost`, `127.0.0.1`, or private internal subnet IPs). Restricting targets to valid, public-facing domains protects internal infrastructure.

---

### 3. Modular Plugin-Based Rule Engine

* **Decision:** Structured SEO diagnostic checks (e.g., Heading Hierarchy, Meta Validation, Image Accessibility, SSL Status) as modular rule plugins rather than a monolithic evaluation function.
* **Reasoning:** A modular rule engine makes the codebase maintainable and scalable. Developers can add, adjust, or toggle new SEO and performance rules independently without touching core scoring logic or API routes, simplifying unit test writing with `pytest`.

```

```