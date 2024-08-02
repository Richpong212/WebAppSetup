# Web Application Setup

This repository contains the configuration and code for a full-stack web application consisting of a backend API and a frontend React application. The application is containerized using Docker and deployed on a Kubernetes cluster.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Structure](#project-structure)
3. [Setting Up the Backend](#setting-up-the-backend)
4. [Setting Up the Frontend](#setting-up-the-frontend)
5. [Docker Configuration](#docker-configuration)
6. [Kubernetes Deployment](#kubernetes-deployment)
7. [Troubleshooting](#troubleshooting)
8. [Contributing](#contributing)

## Prerequisites

- Docker
- Kubernetes (with `kubectl` and `kops`)
- Node.js and npm
- Yarn (optional but recommended)
- Access to Docker Hub or a container registry

## Project Structure

```
webappsetup/
├── backend/
│   ├── Dockerfile.backend
│   ├── src/
│   ├── package.json
│   ├── tsconfig.json
│   └── ...
├── frontend/
│   ├── Dockerfile.frontend
│   ├── src/
│   ├── package.json
│   ├── tsconfig.json
│   └── ...
├── k8s-deploy/
│   ├── backend-deployment.yaml
│   ├── backend-service.yaml
│   ├── frontend-deployment.yaml
│   └── frontend-service.yaml
└── README.md
```

## Setting Up the Backend

1. **Navigate to the Backend Directory**

   ```bash
   cd webapp/backend
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Build the TypeScript Code**

   ```bash
   npm run build
   ```

4. **Start the Backend Locally**

   ```bash
   npm start
   ```

## Setting Up the Frontend

1. **Navigate to the Frontend Directory**

   ```bash
   cd webapp/frontend
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Build the React Application**

   ```bash
   npm run build
   ```

4. **Start the Frontend Locally**

   ```bash
   npm start
   ```

## Docker Configuration

### Backend Dockerfile (`Dockerfile.backend`)

```Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 5001

ENV NODE_ENV=production

CMD ["npm", "start"]
```

### Frontend Dockerfile (`Dockerfile.frontend`)

```Dockerfile
# Stage 1: Build the React application
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

## Kubernetes Deployment

### Backend Deployment (`k8s-deploy/backend-deployment.yaml`)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
  labels:
    app: backend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
        - name: backend
          image: zlenoski/backend:latest # Correct Docker image
          ports:
            - containerPort: 5001
          env:
            - name: PORT
              value: "5001" # Set the correct port environment variable
            - name: NODE_ENV
              value: production
          resources:
            requests:
              memory: "256Mi"
              cpu: "100m"
            limits:
              memory: "512Mi"
              cpu: "500m"
```

### Backend Service (`k8s-deploy/backend-service.yaml`)

```yaml
apiVersion: v1
kind: Service
metadata:
  name: backend
spec:
  selector:
    app: backend
  ports:
    - protocol: TCP
      port: 80
      targetPort: 5001
  type: ClusterIP
```

### Frontend Deployment (`k8s-deploy/frontend-deployment.yaml`)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
  labels:
    app: frontend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
        - name: frontend
          image: zlenoski/frontend:latest
          ports:
            - containerPort: 80
```

### Frontend Service (`k8s-deploy/frontend-service.yaml`)

```yaml
apiVersion: v1
kind: Service
metadata:
  name: frontend
spec:
  selector:
    app: frontend
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
  type: LoadBalancer
```

## Troubleshooting

1. **Check Pod Status**

   ```bash
   kubectl get pods
   ```

2. **Describe Pod**

   ```bash
   kubectl describe pod <pod-name>
   ```

3. **View Pod Logs**

   ```bash
   kubectl logs <pod-name>
   ```

4. **Rebuild Docker Image for Correct Architecture**

   ```bash
   docker build --platform linux/amd64 -t zlenoski/backend:latest -f Dockerfile.backend .
   docker build --platform linux/amd64 -t zlenoski/frontend:latest -f Dockerfile.frontend .
   ```

## Contributing

Feel free to submit pull requests or open issues for improvements or bugs. Ensure to follow the contribution guidelines and code standards.

---

This README provides a clear overview of setting up the backend and frontend, Docker configuration, Kubernetes deployment, and troubleshooting steps. Adjust any paths or commands as necessary for your specific setup.
