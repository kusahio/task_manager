# crud/task.py
from models.task import Task as TaskModel
from config.database import Base, engine
from sqlalchemy.orm import Session
from schemas.task import TaskCreate, TaskUpdate

Base.metadata.create_all(bind=engine)

def create_task(db: Session, task: TaskCreate, user_id: int):
    new_task = TaskModel(**task.model_dump(), user_id=user_id)
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task

def get_task(db: Session, task_id: int, user_id: int):
    user_task = db.query(TaskModel).filter(
        TaskModel.id == task_id,
        TaskModel.user_id == user_id
        ).first()
    return user_task

def get_tasks_by_user(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    user_tasks = db.query(TaskModel)\
        .filter(TaskModel.user_id == user_id)\
        .offset(skip)\
        .limit(limit)\
        .all()
    return user_tasks

def update_task(db: Session, task_id: int, task_update: TaskUpdate, user_id: int):
    db_task = get_task(db, task_id, user_id)

    if not db_task:
        return None

    update_data = task_update.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(db_task, key, value)

    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

def delete_task(db:Session, task_id: int, user_id: int):
    db_task = get_task(db, task_id, user_id)

    if not db_task:
        return None

    db.delete(db_task)
    db.commit()
    return db_task