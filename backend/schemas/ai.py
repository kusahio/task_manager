from pydantic import BaseModel, Field
from typing import Optional, List


class TaskParseResponse(BaseModel):
    """Esquema estricto para la respuesta de extracción de tareas mediante IA"""
    title: str = Field(
        description=(
            "Título breve y específico que describa la acción principal de la tarea. "
            "Debe ser claro, sin información innecesaria y mantener el idioma del texto original."
        )
    )
    description: Optional[str] = Field(
        default=None,
        description=(
            "Información adicional, contexto o detalles relevantes de la tarea que no estén "
            "incluidos en el título. Si el texto no aporta información adicional útil, devolver null."
        )
    )
    deadline: Optional[str] = Field(
        default=None,
        description=(
            "Fecha y hora límite en formato ISO 8601 (YYYY-MM-DDTHH:MM:SS). "
            "Resolver expresiones relativas como 'mañana', 'el próximo lunes' o 'a las 18:00' "
            "utilizando la fecha actual como referencia."
            "Si no existe una fecha u hora explícita o inferible, devolver null."
        )
    )
    tags: List[str] = Field(
        default=[],
        description=(
            "Lista de etiquetas relevantes para clasificar la tarea. "
            "Incluir hashtags presentes en el texto (sin '#') y categorías inferidas cuando sean claras "
            "(por ejemplo: trabajo, estudio, compras, salud, urgente). "
            "Todos los valores deben estar en minúsculas, sin duplicados."
        )
    )

class TaskParseRequest(BaseModel):
    """Esquema de entrada para el endpoint de parseo con IA"""
    text: str = Field(
        ..., 
        description="Texto libre introducido por el usuario para ser analizado."
    )