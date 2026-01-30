#crud/tag.py
from sqlalchemy.orm import Session
from models.tag import Tag as TagModel
from schemas.tag import TagCreate, TagUpdate

def create_tag(db: Session, tag: TagCreate, user_id: int):
    existing_tag = db.query(TagModel).filter(
        TagModel.name == tag.name,
        TagModel.user_id == user_id).first()

    if existing_tag:
        return existing_tag
    
    db_tag = TagModel(
        name=tag.name,
        color=tag.color,
        user_id=user_id
    )

    db.add(db_tag)
    db.commit()
    db.refresh(db_tag)
    return db_tag

def get_tag(db: Session, tag_id: int, user_id: int):
    tag = db.query(TagModel).filter(
      TagModel.id == tag_id,
      TagModel.user_id == user_id).first()

    return tag

def get_tags(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    tags = db.query(TagModel)\
      .filter(TagModel.user_id == user_id)\
      .offset(skip).limit(limit).all()

    return tags

def update_tag(db: Session, user_id: int, tag_id: int, tag_update: TagUpdate):
    db_tag = get_tag(db, tag_id, user_id)

    if not db_tag:
        return None
    
    update_data = tag_update.model_dump(exclude_unset=True)

    if 'name' in update_data:
        new_name = update_data['name']
        existing_name = db.query(TagModel)\
        .filter(
            TagModel.name == new_name,
            TagModel.user_id == user_id,
            TagModel.id != tag_id
        ).first()

        if existing_name:
            return None
    
    for key, value in update_data.items():
        setattr(db_tag, key, value)

    db.add(db_tag)
    db.commit()
    db.refresh(db_tag)
    return db_tag

def delete_tag(db: Session, tag_id: int, user_id: int) -> bool:
    db_tag = get_tag(db, tag_id, user_id)

    if db_tag:
        db.delete(db_tag)
        db.commit()
        return True
    
    return False