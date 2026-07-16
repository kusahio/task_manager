import pytest
from fastapi import status
from schemas.ai import TaskParseResponse

@pytest.fixture
def auth_headers(normal_user_token):
    """Reutiliza el token generado en conftest.py para armar las cabeceras seguras"""
    return {"Authorization": f"Bearer {normal_user_token}"}


def test_parse_task_endpoint_success(client, auth_headers, mocker):
    """POST autenticado con payload correcto - Retorna HTTP 200 y el JSON estructurado"""
    mocker.patch(
        "services.ai_service.parse_task_with_ai",
        return_value=TaskParseResponse(
            title="Tarea de prueba", 
            description="Detalles mockeados", 
            deadline=None, 
            tags=["test"]
        )
    )

    payload = {"text": "Anotar tarea de prueba"}
    response = client.post("/api/v1/ai/parse-task", json=payload, headers=auth_headers)
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["title"] == "Tarea de prueba"
    assert "test" in data["tags"]


def test_parse_task_endpoint_unauthenticated(client):
    """POST sin cabecera de autenticación - Retorna HTTP 401 Unauthorized"""
    payload = {"text": "Comprar pan mañana"}
    response = client.post("/api/v1/ai/parse-task", json=payload)
    
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


def test_parse_task_endpoint_invalid_body(client, auth_headers):
    """POST con un body mal formado (sin el campo obligatorio 'text') - Retorna HTTP 422 Unprocessable Entity"""
    payload = {"mensaje_invalido": "Hola mundo"}
    response = client.post("/api/v1/ai/parse-task", json=payload, headers=auth_headers)
    
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_CONTENT