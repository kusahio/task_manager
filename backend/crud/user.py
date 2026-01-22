# crud/user.py
from models.user import User as UserModel
from config.database import Base, engine
from sqlalchemy.orm import Session
from schemas.user import UserCreate
from utils.security import hash_password

#Base.metadata.create_all(bind=engine)

def get_user_by_email(db: Session, email: str):
    return db.query(UserModel).filter(UserModel.email == email).first()

def get_user(db: Session, user_id: int) -> UserModel | None:
    return db.query(UserModel).filter(user_id == user_id).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(UserModel).offset(skip).limit(limit).all()

def create_user(db: Session, user: UserCreate) -> UserModel:

    hashed_password_gen = hash_password(user.password)

    db_user = UserModel(
        email=user.email,
        name=user.name,
        hashed_password = hashed_password_gen
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user