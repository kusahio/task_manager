from sqlalchemy.orm import Session
from models.tag import Tag as TagModel
from schemas.tag import TagCreate


def create_tag(db: Session, tag: TagCreate, user_id: int):
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
    return db.query(TagModel).filter(
        TagModel.id == tag_id,
        TagModel.user_id == user_id).first()


def get_tag_by_name(db: Session, name: str, user_id: int):
    return db.query(TagModel).filter(
        TagModel.name.ilike(name),
        TagModel.user_id == user_id
    ).first()


def get_tags(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return db.query(TagModel).filter(
        TagModel.user_id == user_id
    ).offset(skip).limit(limit).all()


def update_tag(db: Session, db_tag: TagModel, update_data: dict):
    for key, value in update_data.items():
        setattr(db_tag, key, value)

    db.add(db_tag)
    db.commit()
    db.refresh(db_tag)

    return db_tag


def delete_tag(db: Session, db_tag: TagModel) -> bool:

    db.delete(db_tag)
    db.commit()
    return True