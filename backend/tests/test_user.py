import pytest
from sqlalchemy.orm import Session
from schemas.user import UserCreate
from services import user_service
from utils.errors import AppBaseException, NotFoundException

def test_create_user_success(db: Session):
    """Prueba que un usuario se cree correctamente con la contraseña encriptada"""
    user_data = UserCreate(
        email="test_service@example.com",
        name="Test User",
        password="secure_password123"
    )

    created_user = user_service.create_user(db=db, user=user_data)

    assert created_user.id is not None
    assert created_user.email == "test_service@example.com"
    assert created_user.hashed_password != "secure_password123"

def test_create_user_duplicate_email_throws_exception(db: Session):
    """Prueba que el servicio lance AppBaseException si el email ya existe"""
    user_data = UserCreate(
        email="duplicate@example.com",
        name="Primer Usuario",
        password="password123"
    )
    user_service.create_user(db=db, user=user_data)

    second_user_data = UserCreate(
        email="duplicate@example.com",
        name="Segundo Usuario",
        password="different_password"
    )

    with pytest.raises(AppBaseException) as exc_info:
        user_service.create_user(db=db, user=second_user_data)
    
    assert exc_info.value.status_code == 400
    assert "El email ya existe" in exc_info.value.message

def test_get_user_not_found_throws_exception(db: Session):
    """Prueba que buscar un ID inexistente lance NotFoundException"""
    with pytest.raises(NotFoundException) as exc_info:
        user_service.get_user(db=db, user_id=9999)
    
    assert "Usuario no encontrado" in exc_info.value.message