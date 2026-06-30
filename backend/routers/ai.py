from fastapi import APIRouter, Depends
from schemas.ai import TaskParseRequest, TaskParseResponse
from services import ai_service
from models.user import User
from utils.dependencies import get_current_user

router = APIRouter(prefix="/ai", tags=["AI"])

@router.post("/parse-task", response_model=TaskParseResponse)
def parse_task(request: TaskParseRequest, current_user: User = Depends(get_current_user)):
    """
    Recibe texto en lenguaje natural y devuelve una estructura de tarea validada mediante Inteligencia Artificial.
    """
    parsed_data = ai_service.parse_task_with_ai(request.text)

    return parsed_data