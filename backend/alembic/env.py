#env.py
import os
import sys
from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context
from config.database import Base, engine, DATABASE_URL
# se importan los modelos para que alembic los vea
from models import user, task, tag

# comentado para correr en neon
# sys.path.append(os.path.dirname(os.path.dirname(__file__)))

# aquí se configura para que encuentre la carpeta backend en el servidor de render
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

config = context.config

# Interpretar el archivo de configuración para el registro de Python.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# se sobre escribe la url de alembic.ini con la de render/neon
config.set_main_option('sqlalchemy.url', DATABASE_URL.replace('%', '%%'))

target_metadata = Base.metadata

def run_migrations_offline() -> None:
    url = engine.url

    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={'paramstyle' : 'named'},
    )

    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online() -> None:
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