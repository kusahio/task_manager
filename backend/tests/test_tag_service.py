# backend/tests/test_tag_service.py
import pytest
from sqlalchemy.orm import Session
from schemas.tag import TagCreate, TagUpdate
from schemas.user import UserCreate
from services import tag_service, user_service
from utils.errors import AppBaseException

def test_create_tag_success(db: Session):
    """Prueba la creación exitosa de una etiqueta"""
    user_service.create_user(
        db=db, 
        user=UserCreate(email="taguser1@example.com", name="Tag User", password="password123")
    )
    
    tag_data = TagCreate(name="Urgente", color="#FF0000")
    created_tag = tag_service.create_tag(db=db, tag=tag_data, user_id=1)
    
    assert created_tag.id is not None
    assert created_tag.name == "Urgente"

def test_create_duplicate_tag_returns_existing(db: Session):
    """Regla de negocio: Si ya existe, retorna el tag existente sin duplicar"""
    user_service.create_user(
        db=db, 
        user=UserCreate(email="taguser2@example.com", name="Tag User", password="password123")
    )
    
    tag_data = TagCreate(name="Estudio", color="#0000FF")
    first_tag = tag_service.create_tag(db=db, tag=tag_data, user_id=1)
    second_tag = tag_service.create_tag(db=db, tag=tag_data, user_id=1)
    
    assert first_tag.id == second_tag.id

def test_update_tag_duplicate_name_throws_exception(db: Session):
    """Regla de negocio: No permite renombrar un tag a uno que ya existe"""
    user_service.create_user(
        db=db, 
        user=UserCreate(email="taguser3@example.com", name="Tag User", password="password123")
    )
    
    tag1 = tag_service.create_tag(db=db, tag=TagCreate(name="Personal"), user_id=1)
    tag2 = tag_service.create_tag(db=db, tag=TagCreate(name="Trabajo"), user_id=1)
    
    tag_update = TagUpdate(name="Personal")
    
    with pytest.raises(AppBaseException) as exc_info:
        tag_service.update_tag(db=db, user_id=1, tag_id=tag2.id, tag_update=tag_update)
        
    assert "Ya existe una etiqueta con ese nombre" in exc_info.value.message