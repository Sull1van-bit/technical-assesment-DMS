from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class TicketCreate(BaseModel):
    title: str
    description: str
    submitted_by: str

class TicketAnalysisUpdate(BaseModel):
    urgency_level: str
    severity_score: int
    reasoning: str
    status: str = "analyzed"

class TicketResponse(BaseModel):
    id: int
    title: str
    description: str
    submitted_by: str
    status: str
    urgency_level: Optional[str] = None
    severity_score: Optional[int] = None
    reasoning: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)