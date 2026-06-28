import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from schemas.user import UserCreate
from services import user_service
from utils.jwt_manager import create_access_token

@pytest.fixture
def auth_headers(db: Session):
    """Fixture auxiliar para crear un usuario y generar sus cabeceras de autenticación"""
    user = user_service.create_user(
        db=db, 
        user=UserCreate(email="endpoint_user@example.com", name="Test User", password="password123")
    )

    token = create_access_token(data={"sub": user.email}) 

    return {"Authorization": f"Bearer {token}"}


def test_api_create_task_success(client: TestClient, auth_headers: dict):
    """Test de Integración: POST /api/v1/tasks/ debe crear una tarea y responder 201"""
    payload = {
        "title": "Tarea desde el Endpoint",
        "description": "Probando la integración completa HTTP",
        "completed": False
    }

    response = client.post("/api/v1/tasks/", json=payload, headers=auth_headers)

    assert response.status_code == 201
    
    data = response.json()
    assert data["id"] is not None
    assert data["title"] == "Tarea desde el Endpoint"
    assert data["user_id"] == 1


def test_api_get_tasks_paginated(client: TestClient, auth_headers: dict):
    """Test de Integración: GET /api/v1/tasks/ debe devolver la respuesta pagínada genérica"""

    client.post("/api/v1/tasks/", json={"title": "Task 1", "completed": False}, headers=auth_headers)

    response = client.get("/api/v1/tasks/?skip=0&limit=10", headers=auth_headers)
    
    assert response.status_code == 200
    
    data = response.json()

    assert "total" in data
    assert "skip" in data
    assert "limit" in data
    assert isinstance(data["data"], list)
    assert len(data["data"]) >= 1


def test_api_get_task_unauthorized(client: TestClient):
    """Test de Integración: Si no enviamos token, FastAPI debe responder 401 Unauthorized"""
    response = client.get("/api/v1/tasks/1")

    assert response.status_code == 401