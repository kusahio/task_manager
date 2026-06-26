from sqlalchemy.orm import Session
from schemas.user import UserCreate
from utils.security import hash_password
from utils.errors import AppBaseException, NotFoundException
from ..repositories import user_repository

def create_user(db: Session, user: UserCreate):
    email_exist = user_repository.get_user_by_email(db=db, email=user.email)

    if email_exist:
        raise AppBaseException("El email ya existe", status_code=400)
    
    hashed_password = hash_password(user.password)

    return user_repository.create_user(db=db, user=user, hashed_password=hashed_password)

def get_user(db: Session, user_id: int):
    db_user = user_repository.get_user(db=db, user_id=user_id)

    if not db_user:
        raise NotFoundException("Usuario no encontrado")
    
    return db_user

def get_user_by_email(db: Session, email: str):
    db_user = user_repository.get_user_by_email(db=db, email=email)

    if not db_user:
        raise NotFoundException("Usuario no encontrado")
    
    return db_user

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return user_repository.get_users(db=db, skip=skip, limit=limit)