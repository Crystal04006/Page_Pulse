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