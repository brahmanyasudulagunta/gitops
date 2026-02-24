from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import devplatform, argocd, admin, auth
from database import engine, Base
from models import user, request  # noqa: F401 — ensure models are registered

# Create all tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Platform Control Plane")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth")
app.include_router(devplatform.router, prefix="/devplatform")
app.include_router(argocd.router, prefix="/argocd")
app.include_router(admin.router, prefix="/admin")


@app.get("/health")
def health():
    return {"status": "healthy"}
