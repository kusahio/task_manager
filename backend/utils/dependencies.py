from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from config.database import get_db
from models.user import User as UserModel
from config.settings import settings

oauth_scheme = OAuth2PasswordBearer(tokenUrl='/api/v1/users/token') # antes /login

def get_current_user(token: str = Depends(oauth_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail='No se pudieron validar las credenciales',
        
        headers={'WWW-Authenticate' : 'Bearer'}
    )

    try:
        payload = jwt.decode(
            token,
            settings.secret_key,
            algorithms=[settings.algorithm]
        )

        email: str = payload.get('sub')

        if email is None:
            raise credentials_exception
    
    except JWTError:
        raise credentials_exception
    
    user = db.query(UserModel).filter(UserModel.email == email).first()

    if user is None:
        raise credentials_exception
    
    return user