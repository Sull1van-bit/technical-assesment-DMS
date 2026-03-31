from fastapi import FastAPI, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List
import requests
import os

from .models.ticket import Ticket, Base
from .schemas.ticket import TicketCreate, TicketAnalysisUpdate, TicketResponse
from .core.database import engine, get_db

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Assesment Test DMS"
)

@app.post("/tickets", response_model=TicketResponse)
def create_ticket(ticket: TicketCreate, background_tasks: BackgroundTasks,db: Session = Depends(get_db)):

    new_ticket = Ticket(
        title=ticket.title,
        description=ticket.description,
        submitted_by=ticket.submitted_by,
        status="pending"
    )
    db.add(new_ticket)
    db.commit()
    db.refresh(new_ticket)

    def send_to_n8n():
        try:
            n8n_url = os.getenv("N8N_WEBHOOK_URL")
            if n8n_url:
                requests.post(n8n_url, json={
                "title": new_ticket.title,
                "ticket_id": new_ticket.id,
                "description": new_ticket.description
            })
        except Exception as e:
            print(f"Gagal menghubungi n8n: {e}")

    background_tasks.add_task(send_to_n8n)

    return new_ticket

@app.get("/tickets", response_model=List[TicketResponse])
def get_all_tickets(db: Session = Depends(get_db)):
    return db.query(Ticket).all()

@app.get("/tickets/{ticket_id}", response_model=TicketResponse)
def get_ticket_detail(ticket_id: int, db: Session = Depends(get_db)):
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Tiket tidak ditemukan")
    return ticket

@app.patch("/tickets/{ticket_id}/analysis", response_model=TicketResponse)
def update_ticket_analysis(ticket_id: int, analysis: TicketAnalysisUpdate, db: Session = Depends(get_db)):
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Tiket tidak ditemukan")

    ticket.urgency_level = analysis.urgency_level
    ticket.severity_score = analysis.severity_score
    ticket.reasoning = analysis.reasoning
    ticket.status = "analyzed"

    db.commit()
    db.refresh(ticket)
    return ticket