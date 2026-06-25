from sqlalchemy.orm import Session
from schemas.tag import TagCreate, TagUpdate
from utils.errors import NotFoundException, AppBaseException
from ..repositories import tag_repository

TAG_NOT_FOUND = "Etiqueta no encontrada"

def create_tag(db: Session, tag: TagCreate, user_id: int):
    existing_tag = tag_repository.get_tag_by_name(db=db, name=tag.name, user_id=user_id)

    if existing_tag:
        return existing_tag

    return tag_repository.create_tag(db=db, tag=tag, user_id=user_id)

def get_tag(db: Session, tag_id: int, user_id: int):
    db_tag = tag_repository.get_tag(db=db, tag_id=tag_id, user_id=user_id)

    if not db_tag:
        raise NotFoundException(TAG_NOT_FOUND)
    
    return db_tag

def get_tags(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return tag_repository.get_tags(db=db, user_id=user_id, skip=skip, limit=limit)

def update_tag(db: Session, user_id: int, tag_id: int, tag_update: TagUpdate):
    db_tag = tag_repository.get_tag(db=db, tag_id=tag_id, user_id=user_id)

    if not db_tag:
        raise NotFoundException(TAG_NOT_FOUND)
    
    update_data = tag_update.model_dump(exclude_unset=True)

    if 'name' in update_data:
        new_name = update_data['name']
        existing_name = tag_repository.get_tag_by_name(db, name=new_name, user_id=user_id)

        if existing_name and existing_name.id != tag_id:
            raise AppBaseException("Ya existe una etiqueta con ese nombre", status_code=400)
    
    return tag_repository.update_tag(db=db, db_tag=db_tag, update_data=update_data)

def delete_tag(db: Session, user_id: int, tag_id: int):
    db_tag = tag_repository.get_tag(db=db, tag_id=tag_id, user_id=user_id)

    if not db_tag:
        raise NotFoundException(TAG_NOT_FOUND)
    
    return tag_repository.delete_tag(db=db, db_tag=db_tag)