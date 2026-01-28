# schemas/task.py
from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional, Dict, List
from schemas.tag import Tag

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    completed: bool = False
    deadline: Optional[datetime] = None

class TaskCreate(TaskBase):
    tags: Optional[List[int]] = []

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None
    deadline: Optional[datetime] = None
    tags: Optional[List[int]] = None

class Task(TaskBase):
    id : int
    user_id :  int
    created_at : datetime
    updated_at : datetime
    tags : List[Tag] = []

    model_config = ConfigDict(from_attributes=True)

class TaskSummary(BaseModel):
    total_completed: int
    total_pending: int
    by_tag: Dict[str, int]