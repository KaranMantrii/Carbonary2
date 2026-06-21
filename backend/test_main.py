import pytest
from fastapi.testclient import TestClient
from main import app, categorize_item

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_categorize_item_low():
    item = categorize_item("organic apple")
    assert item is not None
    assert item.impact == "low"
    assert item.xp == 10

def test_categorize_item_high():
    item = categorize_item("beef steak")
    assert item is not None
    assert item.impact == "high"
    assert item.xp == 2

def test_categorize_item_neutral():
    item = categorize_item("random text")
    assert item is None

def test_scan_receipt_no_file():
    response = client.post("/scan-receipt/")
    assert response.status_code == 422 # Unprocessable Entity (FastAPI validation)

def test_scan_receipt_invalid_extension():
    # Create a dummy text file
    response = client.post(
        "/scan-receipt/",
        files={"file": ("test.txt", b"hello world", "text/plain")}
    )
    assert response.status_code == 400
    assert "not allowed" in response.json()["detail"]

def test_scan_receipt_file_too_large():
    # Simulate a file larger than 10MB
    large_content = b"0" * (11 * 1024 * 1024)
    response = client.post(
        "/scan-receipt/",
        files={"file": ("large.jpg", large_content, "image/jpeg")}
    )
    assert response.status_code == 413
    assert "too large" in response.json()["detail"]

def test_vision_proxy_no_api_key(monkeypatch):
    monkeypatch.delenv("GEMINI_API_KEY", raising=False)
    response = client.post("/api/vision", json={"image": "base64data"})
    assert response.status_code == 500
    assert "AI backend not configured" in response.json()["detail"]
