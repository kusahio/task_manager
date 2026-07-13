from sqlalchemy.orm import Session
from repositories import tag_repository
from services import tag_service
from schemas.task import TaskCreate, TaskUpdate
from schemas.tag import TagCreate
from models.task import Task as TaskModel
from utils.errors import NotFoundException
import repositories.task_repository as task_repository

DEFAULT_TAG_COLOR = "#3B82F6"


def create_task(db: Session, task: TaskCreate, user_id: int):
    if task.new_tag_names:
        for name in task.new_tag_names:
            cleaned = name.strip()
            existing = tag_repository.get_tag_by_name(db, cleaned, user_id)
            if not existing:
                tag_service.create_tag(
                    db,
                    TagCreate(name=cleaned, color=DEFAULT_TAG_COLOR),
                    user_id,
                )

    all_tag_ids = list(task.tags) if task.tags else []
    if task.new_tag_names:
        user_tags = tag_repository.get_tags(db, user_id, 0, 200)
        name_to_id = {t.name.lower().strip(): t.id for t in user_tags}
        for name in task.new_tag_names:
            tid = name_to_id.get(name.lower().strip())
            if tid and tid not in all_tag_ids:
                all_tag_ids.append(tid)

    task_data = task.model_dump(exclude={"new_tag_names"})
    task_data["tags"] = all_tag_ids
    return task_repository.create_task(db, TaskCreate(**task_data), user_id)


def get_tasks_summary(db: Session, user_id: int):
    user_tasks = db.query(TaskModel).filter(TaskModel.user_id == user_id).all()
    completed = sum(1 for task in user_tasks if task.completed)
    pending = len(user_tasks) - completed
    tags_count = {}

    for task in user_tasks:
        for tag in task.tags:
            tags_count[tag.name] = tags_count.get(tag.name, 0) + 1

    return {
        'total_completed': completed,
        'total_pending': pending,
        'by_tag': tags_count
    }


def get_task(db: Session, task_id: int, user_id: int):
    db_task = task_repository.get_task(db, task_id=task_id, user_id=user_id)

    if not db_task:
        raise NotFoundException(
            message="La tarea no existe o no tienes permisos")
    return db_task


def get_tasks_by_user(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return task_repository.get_tasks_by_user(db, user_id=user_id, skip=skip, limit=limit)


def update_task(db: Session, task_id: int, task_update: TaskUpdate, user_id: int):
    db_task = task_repository.update_task(
        db, task_id=task_id, task_update=task_update, user_id=user_id)

    if not db_task:
        raise NotFoundException(
            message="No se pudo actualizar: Tarea no encontrada")
    return db_task


def delete_task(db: Session, task_id: int, user_id: int):
    success = task_repository.delete_task(db, task_id=task_id, user_id=user_id)

    if not success:
        raise NotFoundException(
            message="No se pudo eliminar: Tarea no encontrada")
    return success
