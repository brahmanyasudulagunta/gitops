from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from models.schemas import NamespaceRequest
from models.request import InfraRequest
from models.user import User
from database import get_db
from utils.validators import validate_k8s_name
from utils.auth import get_current_user

router = APIRouter()


@router.post("/namespace")
def provision_namespace(
    request: NamespaceRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    validate_k8s_name(request.namespace)

    infra_request = InfraRequest(
        request_type="namespace",
        payload={"namespace": request.namespace},
        user_id=current_user.id,
    )

    db.add(infra_request)
    db.commit()
    db.refresh(infra_request)

    return {
        "status": "Request submitted",
        "id": infra_request.id,
        "request_type": "namespace",
        "namespace": request.namespace,
    }


@router.get("/my-requests")
def get_my_requests(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    from models.request import InfraRequest

    requests = (
        db.query(InfraRequest)
        .filter(InfraRequest.user_id == current_user.id)
        .order_by(InfraRequest.created_at.desc())
        .all()
    )

    return [
        {
            "id": r.id,
            "request_type": r.request_type,
            "payload": r.payload,
            "status": r.status,
            "created_at": str(r.created_at),
            "updated_at": str(r.updated_at),
        }
        for r in requests
    ]
