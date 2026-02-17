# gitops

Application source code and CI pipeline for the **gitops-demo** application. This repo handles building, scanning, and publishing container images.

[![Jenkins](https://img.shields.io/badge/CI-Jenkins-D24939?logo=jenkins&logoColor=white)](https://jenkins.io)
[![Docker](https://img.shields.io/badge/Container-Docker-2496ED?logo=docker&logoColor=white)](https://docker.com)
[![Node.js](https://img.shields.io/badge/Runtime-Node.js-339933?logo=node.js&logoColor=white)](https://nodejs.org)

---

## Role in the Platform

This is the **application development layer** of a three-repo architecture:

| Repository | Role | Tools |
|------------|------|-------|
| [DevPlatform](https://github.com/brahmanyasudulagunta/DevPlatform) | Infrastructure provisioning & security | Terraform, Ansible, RBAC |
| **gitops** (this) | Application development & CI | Node.js, Docker, Jenkins |
| [gitops-prod](https://github.com/brahmanyasudulagunta/gitops-prod) | Deployment manifests (GitOps) | Kubernetes manifests, ArgoCD |

### How It Connects

```
Code push to this repo
    ↓
Jenkins CI builds & scans Docker image
    ↓
Image pushed to DockerHub (ashrith2727/gitops:<BUILD_NUMBER>)
    ↓
Jenkins auto-updates gitops-prod/environments/develop/canary.yaml
    ↓
ArgoCD detects the change and syncs to Kubernetes
```

---

## Project Structure

```
gitops/
├── app/
│   ├── app.js             # Express.js application (port 3000)
│   ├── package.json       # Dependencies (Express)
│   └── Dockerfile         # Node 18 Alpine image
├── Jenkinsfile            # CI pipeline
└── README.md
```

---

## Application

A Node.js Express application with two endpoints:

| Endpoint | Response | Purpose |
|----------|----------|---------|
| `GET /` | `{ "status": "OK", "service": "gitops-demo-app" }` | Main endpoint |
| `GET /health` | `healthy` (200) | Health check for Kubernetes probes |

- **Port:** 3000
- **Image:** `node:18-alpine`
- **Registry:** DockerHub → `ashrith2727/gitops:<tag>`

---

## CI Pipeline (Jenkins)

The Jenkinsfile automates the entire build-to-deploy flow:

| # | Stage | Description |
|---|-------|-------------|
| 1 | **Checkout Code** | Clone this repo (main branch) |
| 2 | **Build & Scan & Push** | Build Docker image → Trivy vulnerability scan (CRITICAL/HIGH) → Push to DockerHub |
| 3 | **Update GitOps Repo** | Clone `gitops-prod` → Update `canary.yaml` image tag → Commit & push |
| 4 | **Cleanup** | Remove local Docker image |

### Key Details

- **Image naming:** `ashrith2727/gitops:<BUILD_NUMBER>`
- **Security scanning:** Trivy blocks builds with CRITICAL or HIGH vulnerabilities (exit-code 1)
- **GitOps update:** Only `environments/develop/canary.yaml` is auto-updated — staging and production require manual promotion
- **Credentials:** DockerHub (`dockerhub`) and GitHub (`github`) credentials stored in Jenkins

### Deployment Flow After CI

```
CI auto-updates canary.yaml (1 replica, develop namespace)
    ↓
Canary validated in develop
    ↓
Manually update deployment.yaml in develop (promote to stable)
    ↓
Manually update staging/deployment.yaml (promote to staging)
    ↓
Manually update production/deployment.yaml (promote to production)
```

---

## Running Locally

```bash
cd app
npm install
node app.js
# App runs on http://localhost:3000
```

### Docker

```bash
docker build -t gitops-demo:local app/
docker run -p 3000:3000 gitops-demo:local
```
