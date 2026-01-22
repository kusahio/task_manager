from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config.database import Base, engine
from routers.api_v1 import api_router
from config.settings import settings

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title='TODO List API',
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

app.include_router(api_router, prefix='/api/v1')

@app.get('/')
def home():
    return {
        'message' : 'Bienvenido a la api de TODO List'
    }