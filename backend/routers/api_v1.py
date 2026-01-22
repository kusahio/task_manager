from fastapi import APIRouter
from routers import user, task, tag

api_router = APIRouter()

api_router.include_router(user.router)
api_router.include_router(task.router)
api_router.include_router(tag.router)