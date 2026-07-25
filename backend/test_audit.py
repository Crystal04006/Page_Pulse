import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, AsyncMock
from app.main import app
from app.core.security import validate_url_security

client = TestClient(app)

# 1. SSRF Guard Unit Test
def test_ssrf_protection_guard():
    safe_url = validate_url_security("https://stripe.com")
    assert isinstance(safe_url, str)
    assert safe_url.startswith("https://")

    with pytest.raises(Exception):
        validate_url_security("http://127.0.0.1")

# 2. Integration Test: Root Endpoint
def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert "architecture" in data

# 3. Integration Test: SSRF Block via API Endpoint
def test_api_ssrf_block_integration():
    response = client.get("/api/audit?url=http://127.0.0.1")
    assert response.status_code == 400
    assert "SSRF" in response.json()["detail"]

# 4. Integration Test: Audit Execution with Mocked HTTP Response
@patch("httpx.AsyncClient.get")
def test_live_audit_endpoint_integration(mock_get):
    # Mock successful HTML response
    mock_response = AsyncMock()
    mock_response.status_code = 200
    mock_response.headers = {"content-type": "text/html; charset=utf-8"}
    mock_response.text = "<html><head><title>Test</title></head><body><h1>Heading</h1></body></html>"
    mock_get.return_value = mock_response

    response = client.get("/api/audit?url=https://example.com")
    assert response.status_code == 200
    data = response.json()
    assert "health_score" in data or "metrics" in data
    