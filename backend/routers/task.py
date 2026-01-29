from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict
from config.database import get_db
from schemas.task import Task, TaskCreate, TaskUpdate, TaskSummary
import crud.task as crud_task
from utils.dependencies import get_current_user
from models.user import User as UserModel

router = APIRouter(prefix='/tasks', tags=['Tasks'])

@router.post('/', response_model=Task, status_code=status.HTTP_201_CREATED)
def create_task(task: TaskCreate, db: Session = Depends(get_db), current_user: UserModel = Depends(get_current_user)):
    db_task_create = crud_task.create_task(db=db, task=task, user_id=current_user.id)
    return db_task_create

@router.get('/summary', response_model=TaskSummary)
def get_tasks_summary(db: Session = Depends(get_db), curren_user: UserModel = Depends(get_current_user)):
    from models.task import Task as TaskModel

    user_tasks = db.query(TaskModel).filter(TaskModel.user_id == curren_user.id).all()
    completed = sum(1 for task in user_tasks if task.completed)
    pending = len(user_tasks) - completed
    tags_count = {}

    for task in user_tasks:
        for tag in task.tags:
            if tag.name in tags_count:
                tags_count[tag.name] += 1
            else:
                tags_count[tag.name] = 1
    
    return {
        'total_completed': completed,
        'total_pending' : pending,
        'by_tag' : tags_count
    }

@router.get('/{task_id}', response_model=Task)
def read_task(task_id: int, db: Session = Depends(get_db), current_user: UserModel = Depends(get_current_user)):
    db_task = crud_task.get_task(db, task_id=task_id,user_id=current_user.id)

    if db_task is None:
        raise HTTPException(status_code=404, detail='Tarea no encontrada')
    
    return db_task

@router.get('/', response_model=List[Task])
def read_tasks(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: UserModel = Depends(get_current_user)):
    db_tasks = crud_task.get_tasks_by_user(db, user_id=current_user.id, skip=skip, limit=limit)  
    return db_tasks

@router.patch('/{task_id}', response_model=Task)
def update_task(task_id: int, task_update: TaskUpdate, db: Session = Depends(get_db), current_user: UserModel = Depends(get_current_user)):
    db_task = crud_task.update_task(db=db, task_id=task_id, task_update=task_update, user_id=current_user.id)

    if db_task is None:
        raise HTTPException(status_code=404, detail='Tarea no encontrada o no tienes permisos')
    
    return db_task

@router.delete('/{task_id}')
def delete_task(task_id: int, db: Session = Depends(get_db), current_user: UserModel = Depends(get_current_user)):
    success = crud_task.delete_task(db, task_id=task_id, user_id=current_user.id)

    if not success:
        raise HTTPException(status_code=404, detail='Tarea no encontrada')
    
    return {'detail' : 'Tarea eliminada correctamente'}