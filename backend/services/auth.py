from sqlalchemy.orm import Session
from models.user import User
from utils.security import verify_password
from crud.user import get_user_by_email

def auth_user(db: Session, email: str, password: str) -> User | None:
    user = get_user_by_email(db, email)

    if not user:
        return None
    
    if not verify_password(password, user.hashed_password):
        return None
    
    return user