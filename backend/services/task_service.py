from sqlalchemy.orm import Session
from schemas.task import TaskCreate, TaskUpdate
from models.task import Task as TaskModel
import crud.task as crud_task

def create_task(db: Session, task: TaskCreate, user_id: int):
    return crud_task.create_task(db, task, user_id)

def get_tasks_summary():
    user_tasks = db.query(TaskModel).filter(TaskModel.user_id == user_id).all()
    completed = sum(1 for task in user_tasks if task.completed)
    pending = len(user_tasks) - completed
    tags_count = {}

    for task in user_tasks:
        for tag in task.tags:
            if tag.name in task.tags:
                tags_count[tag.name] = tags_count.get(tag.name, 0) + 1

    return {
        'total_completed': completed,
        'total_pending': pending,
        'by_tag': tags_count
    }

def get_task(db: Session, task_id: int, user_id: int):
    return crud_task.get_task(db, task_id=task_id, user_id=user_id)

def get_tasks_by_user(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return crud_task.get_tasks_by_user(db, user_id=user_id, skip=skip, limit=limit)

def update_task(db: Session, task_id: int, task_update: TaskUpdate, user_id: int):
    return crud_task.update_task(db, task_id=task_id, task_update=task_update, user_id=user_id)

def delete_task(db: Session, task_id: int, user_id: int):
    return crud_task.delete_task(db,task_id=task_id, user_id=user_id)