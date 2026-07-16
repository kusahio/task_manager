# schemas/tag.py
from pydantic import BaseModel, ConfigDict, field_validator
from typing import Optional

class TagBase(BaseModel):
    name: str
    color: Optional[str] = None

    @field_validator('name')
    @classmethod
    def normalize_name(cls, v: str) -> str:
        return v.strip()

class TagCreate(TagBase):
    pass

class TagUpdate(BaseModel):
    name: Optional[str] = None
    color: Optional[str] = None

class Tag(TagBase):
    id: int
    
    model_config = ConfigDict(from_attributes=True)