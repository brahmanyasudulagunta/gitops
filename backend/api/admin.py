from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from database import get_db
from models.request import InfraRequest
from models.user import User
from utils.auth import require_admin

router = APIRouter()


@router.get("/requests")
def list_requests(
    status: str = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    query = db.query(InfraRequest)

    if status:
        query = query.filter(InfraRequest.status == status.upper())

    requests = query.order_by(InfraRequest.created_at.desc()).all()

    return [
        {
            "id": r.id,
            "request_type": r.request_type,
            "payload": r.payload,
            "status": r.status,
            "user_id": r.user_id,
            "created_at": str(r.created_at),
            "updated_at": str(r.updated_at),
        }
        for r in requests
    ]


@router.get("/requests/{request_id}")
def get_request(
    request_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    request = db.query(InfraRequest).filter(InfraRequest.id == request_id).first()

    if not request:
        raise HTTPException(status_code=404, detail="Request not found")

    return {
        "id": request.id,
        "request_type": request.request_type,
        "payload": request.payload,
        "status": request.status,
        "user_id": request.user_id,
        "created_at": str(request.created_at),
        "updated_at": str(request.updated_at),
    }


@router.post("/approve/{request_id}")
def approve_request(
    request_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    request = db.query(InfraRequest).filter(InfraRequest.id == request_id).first()

    if not request:
        raise HTTPException(status_code=404, detail="Request not found")

    if request.status != "PENDING":
        raise HTTPException(status_code=400, detail=f"Request already {request.status}")

    request.status = "APPROVED"
    db.commit()

    return {"status": "APPROVED", "id": request_id}


@router.post("/reject/{request_id}")
def reject_request(
    request_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    request = db.query(InfraRequest).filter(InfraRequest.id == request_id).first()

    if not request:
        raise HTTPException(status_code=404, detail="Request not found")

    if request.status != "PENDING":
        raise HTTPException(status_code=400, detail=f"Request already {request.status}")

    request.status = "REJECTED"
    db.commit()

    return {"status": "REJECTED", "id": request_id}
