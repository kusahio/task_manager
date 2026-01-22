import os
import sys
from logging.config import fileConfig
from sqlalchemy import engine_from_config
from sqlalchemy import pool
from alembic import context

# 1. AJUSTE DE PATH: Esto es vital para que encuentre 'config' y 'models'
# Esto hace que Python mire en la carpeta 'backend' como raíz
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# 2. IMPORTACIONES DE TU PROYECTO
# Importamos la configuración de la DB y los Modelos para las migraciones
from config.database import Base, engine, DATABASE_URL
from models import user, task, tag  # Asegúrate de importar TODOS tus modelos aquí

# Configuración de Alembic
config = context.config

# Interpretar el archivo de configuración para el registro de Python (logging).
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# 3. SOBREESCRIBIR LA URL DE ALEMBIC.INI
# Usamos la URL que ya calculó tu archivo database.py (leyendo el .env)
# El replace es por si la contraseña tiene símbolos especiales
config.set_main_option('sqlalchemy.url', DATABASE_URL.replace('%', '%%'))

target_metadata = Base.metadata

def run_migrations_offline() -> None:
    """Ejecuta migraciones en modo 'offline'."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online() -> None:
    """Ejecuta migraciones en modo 'online'."""
    # Usamos el 'engine' que ya creaste en database.py para asegurar la conexión correcta
    connectable = engine

    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()