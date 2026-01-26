# routers/user.py
from fastapi import APIRouter, Depends, HTTPException, status, Header
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from config.database import get_db
from crud.user import create_user, get_user_by_email
from schemas.user import UserCreate, User, UserLogin
from services.auth import auth_user
from utils.jwt_manager import create_access_token
from config.settings import settings

router = APIRouter(prefix='/users', tags=['Users'])

def verify_signup_secret(x_signup_token: str = Header(None)):
    if x_signup_token != settings.signup_secret_key:
        raise HTTPException(status_code=403, detail='No tienes permiso para crear usuarios')
    
    return x_signup_token

@router.post('/', response_model=User, status_code=status.HTTP_201_CREATED)
def create_new_user(user: UserCreate, db: Session = Depends(get_db), secret_check: str = Depends(verify_signup_secret)):
    email_exist = get_user_by_email(db, email=user.email)

    if email_exist:
        raise HTTPException(status_code=400, detail='El email ya existe')
    
    return create_user(db=db, user=user)

@router.post('/login')
def login(user_login: UserLogin, db: Session = Depends(get_db)):
    user = auth_user(
        db=db,
        email=user_login.email,
        password=user_login.password
    )
    
    if not user:
        raise HTTPException(status_code=401, detail='Email o Contraseña incorrectos')
    
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
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Email o password incorrectos',
            headers={'WWW-Authenticate' : 'Bearer'})
    
    access_token = create_access_token(data={'sub' : user.email})

    return {'access_token' :  access_token, 'token-type' : 'bearer'}