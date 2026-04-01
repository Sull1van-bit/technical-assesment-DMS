from sqlalchemy.orm import Session
from ..models.ticket import Ticket
from ..schemas.ticket import TicketCreate, TicketAnalysisUpdate

def create_ticket(db: Session, ticket_data: TicketCreate) -> Ticket:
    new_ticket = Ticket(
        title=ticket_data.title,
        description=ticket_data.description,
        submitted_by=ticket_data.submitted_by,
        status="pending"
    )
    db.add(new_ticket)
    db.commit()
    db.refresh(new_ticket)
    return new_ticket

def get_tickets(db: Session):
    return db.query(Ticket).all()

def get_ticket_by_id(db: Session, ticket_id: int) -> Ticket:
    return db.query(Ticket).filter(Ticket.id == ticket_id).first()

def update_ticket_analysis(db: Session, ticket_id: int, analysis: TicketAnalysisUpdate) -> Ticket:
    ticket = get_ticket_by_id(db, ticket_id)
    if not ticket:
        return None
    
    ticket.urgency_level = analysis.urgency_level
    ticket.severity_score = analysis.severity_score
    ticket.reasoning = analysis.reasoning
    ticket.status = analysis.status

    db.commit()
    db.refresh(ticket)
    return ticket
