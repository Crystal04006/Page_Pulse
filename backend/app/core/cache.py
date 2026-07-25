import time
from typing import Dict, Any, Optional

CACHE_TTL_SECONDS = 900  # 15 minutes

class AuditCache:
    def __init__(self, ttl: int = CACHE_TTL_SECONDS):
        self.store: Dict[str, Dict[str, Any]] = {}
        self.ttl = ttl

    def get(self, url: str) -> Optional[Dict[str, Any]]:
        if url in self.store:
            entry = self.store[url]
            if time.time() - entry["timestamp"] < self.ttl:
                return entry["data"]
            else:
                # Expired
                del self.store[url]
        return None

    def set(self, url: str, data: Dict[str, Any]) -> None:
        self.store[url] = {
            "timestamp": time.time(),
            "data": data
        }

# Singleton instances and helper wrapper functions
_cache_instance = AuditCache()

def get_cached_audit(url: str) -> Optional[Dict[str, Any]]:
    return _cache_instance.get(url)

def set_cached_audit(url: str, data: Dict[str, Any]) -> None:
    _cache_instance.set(url, data)