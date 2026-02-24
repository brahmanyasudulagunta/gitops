from sqlalchemy import Column, Integer, String, DateTime, JSON, ForeignKey
from sqlalchemy.sql import func
from database import Base


class InfraRequest(Base):
    __tablename__ = "infra_requests"

    id = Column(Integer, primary_key=True, index=True)
    request_type = Column(String, nullable=False)        # "namespace" or "argocd_app"
    payload = Column(JSON, nullable=False)                # {"namespace": "payments"} etc.
    status = Column(String, default="PENDING")            # PENDING / APPROVED / REJECTED
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
