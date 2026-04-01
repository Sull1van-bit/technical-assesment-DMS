import os
import requests
from ..core.database import SessionLocal
from ..models.ticket import Ticket

def send_to_n8n_webhook(ticket_id: int, title: str, description: str):
    try:
        n8n_url = os.getenv("N8N_WEBHOOK_URL")
        if n8n_url:
            response = requests.post(n8n_url, json={
                "title": title,
                "ticket_id": ticket_id,
                "description": description
            }, timeout=10)
            response.raise_for_status()
    except Exception as e:
        print(f"Gagal menghubungi n8n: {e}")
        db = SessionLocal()
        try:
            ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
            if ticket:
                ticket.urgency_level = "Unknown"
                ticket.status = "pending"
                ticket.reasoning = f"Gagal menghubungi n8n: {str(e)}"
                db.commit()
        except Exception as db_err:
            print(f"Database error: {db_err}")
        finally:
            db.close()
