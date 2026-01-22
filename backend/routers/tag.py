# router/tag.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from config.database import get_db
from schemas.tag import Tag, TagCreate, TagUpdate
import crud.tag as crud_tag
from models.user import User as UserModel
from utils.dependencies import get_current_user

router = APIRouter(prefix='/tags', tags=['Tags'])

@router.post('/', response_model=Tag, status_code=status.HTTP_201_CREATED)
def create_tag(tag: TagCreate, db: Session = Depends(get_db), current_user: UserModel = Depends(get_current_user)):
    created_tag = crud_tag.create_tag(db=db, tag=tag)
    return created_tag

@router.get('/', response_model=List[Tag])
def read_tags(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: UserModel = Depends(get_current_user)):
    db_tags = crud_tag.get_tags(db, skip=skip, limit=limit)
    return db_tags

@router.get('/{tag_id}', response_model=Tag)
def read_tag(tag_id: int, db: Session = Depends(get_db), current_user: UserModel = Depends(get_current_user)):
    db_tag = crud_tag.get_tag(db, tag_id=tag_id)

    if db_tag is None:
        raise HTTPException(status_code=404, detail='Tag no encontrado')
    return db_tag

@router.patch('/{tag_id}', response_model=Tag)
def update_tag(tag_id: int, tag_update: TagUpdate, db: Session = Depends(get_db), current_user: UserModel = Depends(get_current_user)):
    db_tag = crud_tag.update_tag(db, tag_id=tag_id, tag_update=tag_update)

    if db_tag is None:
        raise HTTPException(status_code=404, detail='No se pudo actualizar el tag')
    
    return db_tag

@router.delete('/{tag_id}')
def delete_tag(tag_id: int, db: Session = Depends(get_db), current_user: UserModel = Depends(get_current_user)):
    success = crud_tag.delete_tag(db, tag_id=tag_id)
    if not success:
        raise HTTPException(status_code=404, detail='Tag no encontrado')
    
    return {'detail' : 'Tag eliminado con éxito'}