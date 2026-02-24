# Platform Control Plane

Internal Developer Platform for managing infrastructure requests with an approval-based GitOps workflow.

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-4169E1?logo=postgresql&logoColor=white)](https://postgresql.org)
[![Docker](https://img.shields.io/badge/Container-Docker-2496ED?logo=docker&logoColor=white)](https://docker.com)

---

## Architecture

```
User → React UI → FastAPI → PostgreSQL → Admin Reviews → Manual Git Commit → Terraform/ArgoCD
```

This platform follows an **approval-based GitOps** pattern:

1. Users submit infrastructure requests (namespaces, ArgoCD apps) via the UI
2. Requests are stored in PostgreSQL with `PENDING` status
3. Admins review and approve/reject requests from the Admin Dashboard
4. Approved requests are manually committed to Git by the admin
5. GitOps pipelines (Terraform, ArgoCD) apply the changes automatically

> **Why no auto-push to Git?** This design removes Git credentials from the backend, eliminates token management and push errors, and ensures human approval before infrastructure changes — matching enterprise governance standards.

---

## Role in the Platform

| Repository | Role | Tools |
|------------|------|-------|
| [DevPlatform](https://github.com/brahmanyasudulagunta/DevPlatform) | Infrastructure provisioning & security | Terraform, Ansible, RBAC |
| **gitops** (this) | Platform Control Plane (UI + API) | FastAPI, React, PostgreSQL |
| [gitops-prod](https://github.com/brahmanyasudulagunta/gitops-prod) | Deployment manifests (GitOps) | Kubernetes manifests, ArgoCD |

---

## Project Structure

```
gitops/
├── backend/
│   ├── api/
│   │   ├── auth.py           # Register, Login, JWT
│   │   ├── admin.py          # List, Approve, Reject requests
│   │   ├── devplatform.py    # Submit namespace requests
│   │   └── argocd.py         # Submit ArgoCD app requests
│   ├── models/
│   │   ├── user.py           # User model (username, role)
│   │   ├── request.py        # InfraRequest model
│   │   └── schemas.py        # Pydantic schemas
│   ├── utils/
│   │   ├── auth.py           # JWT middleware, role guards
│   │   └── validators.py     # K8s name & image validation
│   ├── database.py           # SQLAlchemy engine & session
│   ├── config.py             # Environment configuration
│   ├── main.py               # FastAPI app entry point
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx          # Login page
│   │   │   ├── Register.jsx       # Signup page
│   │   │   ├── Dashboard.jsx      # User request tracker
│   │   │   ├── DevPlatform.jsx    # Namespace request form
│   │   │   ├── ArgoCD.jsx         # ArgoCD app request form
│   │   │   ├── AdminDashboard.jsx # Admin request management
│   │   │   └── RequestDetail.jsx  # Request detail + approve/reject
│   │   ├── context/
│   │   │   └── AuthContext.jsx    # JWT auth state
│   │   ├── components/
│   │   │   ├── Layout.jsx         # Nav bar with role-based links
│   │   │   └── ProtectedRoute.jsx # Route guard
│   │   └── services/
│   │       └── api.js             # API client with auth headers
│   ├── nginx.conf                 # Reverse proxy to backend
│   └── Dockerfile
├── docker-compose.yml             # PostgreSQL + Backend + Frontend
└── README.md
```

---

## API Endpoints

### Auth (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/register` | Create new user account |
| `POST` | `/auth/login` | Login, returns JWT token |
| `GET` | `/auth/me` | Get current user info |

### User (Requires Auth)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/devplatform/namespace` | Submit namespace request |
| `POST` | `/argocd/application` | Submit ArgoCD app request |
| `GET` | `/devplatform/my-requests` | View own requests |

### Admin (Requires Admin Role)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/admin/requests` | List all requests (filter by status) |
| `GET` | `/admin/requests/{id}` | Get request details |
| `POST` | `/admin/approve/{id}` | Approve a request |
| `POST` | `/admin/reject/{id}` | Reject a request |

---

## Running Locally

```bash
# Start all services
docker compose up -d

# Services:
#   PostgreSQL  → localhost:5434
#   Backend API → localhost:8001 (Swagger docs at /docs)
#   Frontend UI → localhost:4000
```

### First-Time Setup

1. Open `http://localhost:4000` and register an account
2. Promote your user to admin:
   ```bash
   docker exec postgres-gitops psql -U krishna -d postgresdb \
     -c "UPDATE users SET role='admin' WHERE username='YOUR_USERNAME';"
   ```
3. Log out and log back in to get admin access

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, React Router |
| Backend | FastAPI, SQLAlchemy, Pydantic |
| Database | PostgreSQL 16 |
| Auth | JWT (PyJWT), bcrypt |
| Proxy | Nginx |
| Container | Docker, Docker Compose |
