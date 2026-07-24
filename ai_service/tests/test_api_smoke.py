from fastapi.testclient import TestClient

from main import app


client = TestClient(app)


def test_health_check():
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_chat_endpoint_returns_reply_and_actions():
    response = client.post(
        "/api/ai/chat",
        json={"message": "How do I pay property tax?", "language": "en"},
    )

    payload = response.json()
    assert response.status_code == 200
    assert "property tax" in payload["reply"]
    assert payload["suggested_actions"]


def test_search_endpoint_returns_ranked_results():
    response = client.post(
        "/api/ai/search",
        json={"query": "birth certificate", "top_k": 3},
    )

    payload = response.json()
    assert response.status_code == 200
    assert payload["results"][0]["title"] == "Birth Certificate Application"
    assert payload["results"][0]["score"] > 0
