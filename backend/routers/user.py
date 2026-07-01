from fastapi import APIRouter, Depends, status, Header
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from config.database import get_db
from schemas.user import UserCreate, User, UserLogin
from services.auth_service import auth_user
from utils.jwt_manager import create_access_token
from utils.errors import UnauthorizedException, ForbiddenException
from config.settings import settings

import services.user_service as user_service

router = APIRouter(prefix='/users', tags=['Users'])

def verify_signup_secret(x_signup_token: str = Header(None)):
    if x_signup_token != settings.signup_secret_key:
        raise ForbiddenException(message="No tienes permiso para crear usuarios")
    
    return x_signup_token

@router.post('/', response_model=User, status_code=status.HTTP_201_CREATED)
def create_new_user(user: UserCreate, db: Session = Depends(get_db), secret_check: str = Depends(verify_signup_secret)):
    return user_service.create_user(db=db, user=user)

@router.get('/{user_id}', response_model=User)
def get_user(user_id: int, db: Session = Depends(get_db)):
    return user_service.get_user(db=db, user_id=user_id)

@router.get('/email/{email}', response_model=User)
def get_user_by_email(email: str, db: Session = Depends(get_db)):
    return user_service.get_user_by_email(db=db, email=email)

@router.get('/', response_model=list[User])
def get_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return user_service.get_users(db=db, skip=skip, limit=limit)


@router.post('/login')
def login(user_login: UserLogin, db: Session = Depends(get_db)):
    user = auth_user(
        db=db,
        email=user_login.email,
        password=user_login.password
    )
    
    if not user:
        raise UnauthorizedException(message="Email o Contraseña incorrectos")
    
    access_token = create_access_token(data={'sub' : user.email})
    
    return {
        'message' : 'Inicio de sesion exitoso',
        'access_token' : access_token,
        'token_type' :  'bearer',
        'user' : {
            'id' : user.id,
            'email' : user.email,
            'name' : user.name
        }
    }

@router.post('/token', response_model=dict)
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = auth_user(db, email=form_data.username, password=form_data.password)

    if not user:
        raise UnauthorizedException(message="Email o Contraseña incorrectos")
    
    access_token = create_access_token(data={'sub' : user.email})

    return {'access_token' :  access_token, 'token_type' : 'bearer'}