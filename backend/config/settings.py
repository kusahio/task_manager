from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    #seguridad para swagger
    signup_secret_key: str

    # seguridad jwt
    secret_key: str
    algorithm: str
    access_token_expire_minutes: int

    # variables db
    db_user: Optional[str] = None
    db_password: Optional[str] = None
    db_host: Optional[str] = None
    db_port: Optional[str] = None
    db_name: Optional[str] = None

    # cors
    localhost_origin: str

    model_config = SettingsConfigDict(
        env_file='.env',
        env_file_encoding='utf-8'
    )

settings = Settings()