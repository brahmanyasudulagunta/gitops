from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from models.schemas import ArgoAppRequest
from models.request import InfraRequest
from models.user import User
from database import get_db
from utils.validators import validate_k8s_name, validate_image
from utils.auth import get_current_user

router = APIRouter()


@router.post("/application")
def create_application(
    request: ArgoAppRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    validate_k8s_name(request.app_name)
    validate_k8s_name(request.namespace)
    validate_image(request.image)

    infra_request = InfraRequest(
        request_type="argocd_app",
        payload={
            "app_name": request.app_name,
            "namespace": request.namespace,
            "image": request.image,
        },
        user_id=current_user.id,
    )

    db.add(infra_request)
    db.commit()
    db.refresh(infra_request)

    return {
        "status": "Request submitted",
        "id": infra_request.id,
        "request_type": "argocd_app",
        "app_name": request.app_name,
    }
