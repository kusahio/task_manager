from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List
from config.database import get_db
from schemas.tag import Tag, TagCreate, TagUpdate
from utils.dependencies import get_current_user
from models.user import User as UserModel
import services.tag_service as tag_service

router = APIRouter(prefix='/tags', tags=['Tags'])

@router.post('/', response_model=Tag, status_code=status.HTTP_201_CREATED)
def create_tag(tag: TagCreate, db: Session = Depends(get_db), current_user: UserModel = Depends(get_current_user)):
    return tag_service.create_tag(db=db, tag=tag, user_id=current_user.id)

@router.get('/', response_model=List[Tag])
def read_tags(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: UserModel = Depends(get_current_user)):
    return tag_service.get_tags(db=db, user_id=current_user.id, skip=skip, limit=limit)

@router.get('/{tag_id}', response_model=Tag)
def read_tag(tag_id: int, db: Session = Depends(get_db), current_user: UserModel = Depends(get_current_user)):
    return tag_service.get_tag(db=db, tag_id=tag_id, user_id=current_user.id)

@router.patch('/{tag_id}', response_model=Tag)
def update_tag(tag_id: int, tag_update: TagUpdate, db: Session = Depends(get_db), current_user: UserModel = Depends(get_current_user)):
    return tag_service.update_tag(db=db, user_id=current_user.id, tag_id=tag_id, tag_update=tag_update)

@router.delete('/{tag_id}')
def delete_tag(tag_id: int, db: Session = Depends(get_db), current_user: UserModel = Depends(get_current_user)):
    tag_service.delete_tag(db=db, user_id=current_user.id, tag_id=tag_id)