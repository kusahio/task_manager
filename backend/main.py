# backend/main.py
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from routers.api_v1 import api_router
from config.settings import settings
from utils.errors import AppBaseException
from utils.logger import logger

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Task Manager API iniciada correctamente")

    yield

    logger.info("Task Manager API deteniendo servicios...")

app = FastAPI(
    title='Task Manager API',
    description='API creada con FastAPI, SQLAlchemy y Pydantic',
    version='1.0.0',
    lifespan=lifespan
)

origins = [
    settings.localhost_origin,
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(AppBaseException)
async def app_base_exception_handler(request: Request, exc: AppBaseException):
    logger.warning(f"Error: {exc.message} | Path: {request.url.path}")

    return JSONResponse(
        status_code=exc.status_code,
        content={
            "status": "error",
            "code": exc.status_code,
            "message": exc.message
        }
    )


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Error interno no controlado: {str(exc)} | Path: {request.url.path}")
    return JSONResponse(
        status_code=500,
        content={
            "status": "error", 
            "code": 500, 
            "message": "Error interno del servidor"
        }
    )

app.include_router(api_router, prefix='/api/v1')


@app.get('/')
def home():
    return {
        'message': 'Bienvenido a la api de Task Manager'
    }