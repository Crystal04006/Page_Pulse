import sqlite3
import os
from typing import List, Dict, Any, Optional

DB_PATH = os.path.join(os.path.dirname(__file__), "history.db")

def init_db():
    """Initialize the SQLite database schema if it doesn't exist."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS audit_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            url TEXT NOT NULL,
            score INTEGER NOT NULL,
            response_time_ms INTEGER NOT NULL,
            status_code INTEGER NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()

# Initialize DB on module import
init_db()

def save_audit_record(url: str, score: int, response_time_ms: int, status_code: int) -> None:
    """Save an audit entry to the database."""
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO audit_history (url, score, response_time_ms, status_code) VALUES (?, ?, ?, ?)",
            (url, score, response_time_ms, status_code)
        )
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"[DB Write Error] Failed to persist audit record: {e}")

def get_audit_history(url_filter: Optional[str] = None) -> List[Dict[str, Any]]:
    """Retrieve audit history records."""
    try:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()

        if url_filter:
            cursor.execute(
                "SELECT * FROM audit_history WHERE url = ? ORDER BY created_at DESC LIMIT 20",
                (url_filter,)
            )
        else:
            cursor.execute(
                "SELECT * FROM audit_history ORDER BY created_at DESC LIMIT 20"
            )

        rows = cursor.fetchall()
        conn.close()

        return [
            {
                "id": f"hist-{row['id']}",
                "url": row["url"],
                "health_score": row["score"],
                "response_time_ms": row["response_time_ms"],
                "status_code": row["status_code"],
                "created_at": row["created_at"]
            }
            for row in rows
        ]
    except Exception as e:
        print(f"[DB Read Error] Failed to read history: {e}")
        return []