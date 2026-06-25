from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict
from config.database import get_db
from schemas.task import Task, TaskCreate, TaskUpdate, TaskSummary
from utils.dependencies import get_current_user
from models.user import User as UserModel

import services.task_service as task_service

router = APIRouter(prefix='/tasks', tags=['Tasks'])

@router.post('/', response_model=Task, status_code=status.HTTP_201_CREATED)
def create_task(task: TaskCreate, db: Session = Depends(get_db), current_user: UserModel = Depends(get_current_user)):
    return task_service.create_task(db=db, task=task, user_id=current_user.id)

@router.get('/summary', response_model=TaskSummary)
def get_tasks_summary(db: Session = Depends(get_db), current_user: UserModel = Depends(get_current_user)):
    return task_service.get_tasks_summary(db=db, user_id=current_user.id)

@router.get('/{task_id}', response_model=Task)
def read_task(task_id: int, db: Session = Depends(get_db), current_user: UserModel = Depends(get_current_user)):
    return task_service.get_task(db=db, task_id=task_id, user_id=current_user.id)

@router.get('/', response_model=List[Task])
def read_tasks(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: UserModel = Depends(get_current_user)):
    return task_service.get_tasks_by_user(db=db, user_id=current_user.id, skip=skip, limit=limit) 

@router.patch('/{task_id}', response_model=Task)
def update_task(task_id: int, task_update: TaskUpdate, db: Session = Depends(get_db), current_user: UserModel = Depends(get_current_user)):
    return task_service.update_task(db=db, task_id=task_id, task_update=task_update, user_id=current_user.id)

@router.delete('/{task_id}')
def delete_task(task_id: int, db: Session = Depends(get_db), current_user: UserModel = Depends(get_current_user)):
    task_service.delete_task(db=db, task_id=task_id, user_id=current_user.id)
    return {"detail": "Tarea eliminada exitosamente"}