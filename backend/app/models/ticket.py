from sqlalchemy import Column, Integer, String, Text, Enum, DateTime, func
from sqlalchemy.orm import declarative_base
import datetime

Base = declarative_base()

class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    submitted_by = Column(String(255), nullable=False)
    status = Column(String(20), default="pending") 
    urgency_level = Column(String(20), nullable=True) 
    severity_score = Column(Integer, nullable=True)
    reasoning = Column(Text, nullable=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())