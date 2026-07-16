import pytest
from sqlalchemy.orm import Session
from services import auth_service
from schemas.user import UserCreate
from services import user_service

def test_auth_user_success(db: Session):
    """Prueba que el login sea exitoso con credenciales correctas"""
    user_service.create_user(
        db=db, 
        user=UserCreate(email="auth@example.com", name="Auth", password="CorrectPassword123")
    )
    
    user = auth_service.auth_user(db=db, email="auth@example.com", password="CorrectPassword123")
    assert user is not None
    assert user.email == "auth@example.com"

def test_auth_user_wrong_password(db: Session):
    """Prueba que devuelva None si la contraseña es incorrecta"""
    user_service.create_user(
        db=db, 
        user=UserCreate(email="auth2@example.com", name="Auth", password="CorrectPassword123")
    )
    
    user = auth_service.auth_user(db=db, email="auth2@example.com", password="WrongPassword!")
    assert user is None

def test_auth_user_not_found(db: Session):
    """Prueba que devuelva None si el email no existe"""
    user = auth_service.auth_user(db=db, email="nobody@example.com", password="password123")
    assert user is None