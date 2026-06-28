from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from routers.api_v1 import api_router
from config.settings import settings
from utils.errors import AppBaseException

app = FastAPI(
    title='Task Manager API',
    description='API creada con FastAPI, SQLAlchemy y Pydantic',
    version='1.0.0'
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
async def app_base_exception_handler(request, exc: AppBaseException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "status": "error",
            "code": exc.status_code,
            "message": exc.message
        }
    )

app.include_router(api_router, prefix='/api/v1')

@app.get('/')
def home():
    return {
        'message': 'Bienvenido a la api de TODO List'
    }