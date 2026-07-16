# backend/tests/test_task_service.py
import pytest
from sqlalchemy.orm import Session
from schemas.task import TaskCreate, TaskUpdate
from schemas.user import UserCreate
from services import task_service, user_service
from utils.errors import NotFoundException

def test_create_task_success(db: Session):
    """Prueba que una tarea se guarde correctamente asociada a su usuario"""
    user_service.create_user(
        db=db, 
        user=UserCreate(email="taskuser1@example.com", name="Task User", password="password123")
    )

    task_data = TaskCreate(
        title="Terminar los tests unitarios",
        description="Blindar la capa de servicios con Pytest",
        completed=False
    )
    
    created_task = task_service.create_task(db=db, task=task_data, user_id=1)
    
    assert created_task.id is not None
    assert created_task.title == "Terminar los tests unitarios"
    assert created_task.user_id == 1

def test_get_task_not_found_throws_exception(db: Session):
    """Prueba que buscar una tarea inexistente lance NotFoundException"""
    with pytest.raises(NotFoundException) as exc_info:
        task_service.get_task(db=db, task_id=999, user_id=1)
        
    assert "La tarea no existe o no tienes permisos" in exc_info.value.message

def test_update_task_success(db: Session):
    """Prueba que una tarea se actualice correctamente"""
    user_service.create_user(
        db=db, 
        user=UserCreate(email="upd@example.com", name="Task User", password="password123")
    )

    task = task_service.create_task(
        db=db, 
        task=TaskCreate(title="Original", description="Vieja", completed=False), 
        user_id=1
    )
    
    task_update = TaskUpdate(title="Actualizada", completed=True)
    updated_task = task_service.update_task(db=db, task_id=task.id, task_update=task_update, user_id=1)
    
    assert updated_task.title == "Actualizada"
    assert updated_task.completed is True

def test_delete_task_success(db: Session):
    """Prueba que una tarea se elimine y ya no sea accesible"""
    user_service.create_user(
        db=db, 
        user=UserCreate(email="del@example.com", name="Task User", password="password123")
    )
    task = task_service.create_task(
        db=db, 
        task=TaskCreate(title="A Eliminar", description="...", completed=False), 
        user_id=1
    )
    
    success = task_service.delete_task(db=db, task_id=task.id, user_id=1)
    assert success is not None
    
    with pytest.raises(NotFoundException):
        task_service.get_task(db=db, task_id=task.id, user_id=1)