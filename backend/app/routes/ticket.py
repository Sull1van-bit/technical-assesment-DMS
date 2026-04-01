from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List

from ..schemas.ticket import TicketCreate, TicketAnalysisUpdate, TicketResponse
from ..core.database import get_db
from ..services import ticket as ticket_service
from ..services.n8n import send_to_n8n_webhook

router = APIRouter(
    prefix="/tickets",
    tags=["Tickets"]
)

@router.post("", response_model=TicketResponse)
def create_ticket(ticket: TicketCreate, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    new_ticket = ticket_service.create_ticket(db, ticket)
    
    background_tasks.add_task(
        send_to_n8n_webhook, 
        ticket_id=new_ticket.id, 
        title=new_ticket.title, 
        description=new_ticket.description
    )
    return new_ticket

@router.get("", response_model=List[TicketResponse])
def get_all_tickets(db: Session = Depends(get_db)):
    return ticket_service.get_tickets(db)

@router.get("/{ticket_id}", response_model=TicketResponse)
def get_ticket_detail(ticket_id: int, db: Session = Depends(get_db)):
    ticket = ticket_service.get_ticket_by_id(db, ticket_id)
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return ticket

@router.patch("/{ticket_id}/analysis", response_model=TicketResponse)
def update_ticket_analysis(ticket_id: int, analysis: TicketAnalysisUpdate, db: Session = Depends(get_db)):
    ticket = ticket_service.update_ticket_analysis(db, ticket_id, analysis)
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return ticket
