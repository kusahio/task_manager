# tests/conftest.py
import pytest
from fastapi.testclient import TestClient
from config.database import Base, engine, get_db, SessionLocal
from models.user import User
from models.task import Task
from models.tag import Tag
from main import app

@pytest.fixture(scope="function")
def db_session():
    """Sesión de base de datos que se limpia después de cada test"""
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        # Limpiar todas las tablas
        Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def client(db_session):
    """Cliente de test que usa la sesión de base de datos del fixture"""
    def override_get_db():
        try:
            yield db_session
        finally:
            pass
    
    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app)
    app.dependency_overrides.clear()