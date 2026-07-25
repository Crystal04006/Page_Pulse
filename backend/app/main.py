from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import httpx
import time
from typing import Optional

from app.core.security import validate_url_security
from app.core.cache import get_cached_audit, set_cached_audit
from app.db.database import save_audit_record, get_audit_history
from app.services.evaluator import run_full_audit

app = FastAPI(title="Page Pulse Audit Engine", version="3.1.0")

# Enhanced CORS for Seamless Local Vite Connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS", "HEAD"],
    allow_headers=["*"],
    expose_headers=["*"],
)

@app.get("/")
def root():
    return {
        "status": "online",
        "system": "Page Pulse Audit Engine v3.1",
        "architecture": "Plugin-Based Rule Engine",
        "features": ["SSRF Protection", "In-Memory TTL Cache", "SQLite Persistence", "Multi-Rule SEO & Performance Scoring"]
    }

@app.get("/api/audit")
async def run_audit(url: str = Query(..., description="The target web URL to inspect")):
    # 1. SSRF Guard
    try:
        sanitized_url = validate_url_security(url.strip())
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid or unsafe URL parameter: {str(e)}")

    # 2. Check Cache
    cached_report = get_cached_audit(sanitized_url)
    if cached_report:
        return cached_report

    start_time = time.time()
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) PagePulseInspector/3.1"
    }

    try:
        async with httpx.AsyncClient(follow_redirects=True, timeout=10.0) as client:
            response = await client.get(sanitized_url, headers=headers)
            latency_ms = int((time.time() - start_time) * 1000)

            content_type = response.headers.get("content-type", "")
            if "text/html" not in content_type.lower():
                raise HTTPException(
                    status_code=400,
                    detail=f"MIME Type Error: Expected 'text/html' but received '{content_type}'. Page Pulse only audits HTML web pages."
                )

            # 3. Direct, safe invocation matching run_full_audit signature
            audit_result = await run_full_audit(
                url=sanitized_url,
                status_code=response.status_code,
                html=response.text,
                latency_ms=latency_ms,
                headers=dict(response.headers)
            )

            # Ensure metrics contain actual response metadata
            if isinstance(audit_result, dict):
                if "metrics" not in audit_result:
                    audit_result["metrics"] = {}
                audit_result["metrics"]["status_code"] = response.status_code
                audit_result["metrics"]["response_time_ms"] = latency_ms

            # 4. Cache & Persist
            set_cached_audit(sanitized_url, audit_result)
            
            score = audit_result.get("health_score", 100) if isinstance(audit_result, dict) else 100
            save_audit_record(sanitized_url, score, latency_ms, response.status_code)

            return audit_result

    except HTTPException:
        raise
    except httpx.TimeoutException:
        raise HTTPException(
            status_code=504,
            detail="Timeout Error: Target website failed to respond within 10 seconds."
        )
    except httpx.RequestError as e:
        raise HTTPException(
            status_code=400,
            detail=f"Network Connection Failure: Unable to reach destination URL ({str(e)})."
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Internal Inspection Error: {str(e)}"
        )

@app.get("/api/history")
async def get_history(url: Optional[str] = None):
    history = get_audit_history(url)
    return {"history": history}