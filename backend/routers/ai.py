from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from schemas.ai import (
    TaskParseRequest, TaskParseResponse,
    ChatRequest, ChatResponse,
    SuggestRequest, SuggestResponse,
)
from schemas.tag import TagCreate
from services import ai_service
from models.user import User
from utils.dependencies import get_current_user
from config.database import get_db


router = APIRouter(prefix="/ai", tags=["AI"])


@router.post("/parse-task", response_model=TaskParseResponse)
def parse_task(request: TaskParseRequest, current_user: User = Depends(get_current_user)):
    parsed_data = ai_service.parse_task_with_ai(request.text)

    return parsed_data


@router.post("/chat", response_model=ChatResponse)
def chat(
    request: ChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return ai_service.chat_with_ai(
        db=db,
        user_id=current_user.id,
        messages=[m.model_dump() for m in request.messages],
    )


@router.post("/suggest", response_model=SuggestResponse)
def suggest(
    request: SuggestRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return ai_service.suggest_tags(
        db=db,
        user_id=current_user.id,
        title=request.title,
        description=request.description,
    )
