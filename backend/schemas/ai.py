from pydantic import BaseModel, Field
from typing import Optional, List, Literal


class TaskParseResponse(BaseModel):
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
    text: str = Field(
        ...,
        description="Texto libre introducido por el usuario para ser analizado."
    )


class ChatMessageSchema(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class ChatRequest(BaseModel):
    messages: List[ChatMessageSchema]


class TaskPreview(BaseModel):
    title: str
    description: Optional[str] = None
    deadline: Optional[str] = None
    existing_tag_ids: List[int] = []
    new_tag_names: List[str] = []


class ChatAction(BaseModel):
    type: Literal["create_tasks", "none"] = "none"
    data: Optional[dict] = None


class ChatResponse(BaseModel):
    action: ChatAction = ChatAction()
    message: str = ""


class TagSuggestionItem(BaseModel):
    name: str
    exists: bool = False
    tag_id: Optional[int] = None


class SuggestRequest(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None


class SuggestResponse(BaseModel):
    suggested_tags: List[TagSuggestionItem] = []
