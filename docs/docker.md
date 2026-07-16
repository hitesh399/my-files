# Docker & Docker Compose Quick Reference

## Docker Images

### Build Image
```bash
docker build -t my-app .
```
Builds a Docker image from the Dockerfile.

### Build Without Cache
```bash
docker build --no-cache -t my-app .
```
Builds image from scratch.

### List Images
```bash
docker images
```
Shows all local images.

### Remove Image
```bash
docker rmi <image-id>
```
Removes an image.

---

## Docker Containers

### Run Container
```bash
docker run my-app
```
Starts a container.

### Run With Port Mapping
```bash
docker run -p 8080:80 my-app
```
Maps host port 8080 to container port 80.

### Run In Background
```bash
docker run -d my-app
```
Runs container in detached mode.

### List Running Containers
```bash
docker ps
```
Shows running containers.

### List All Containers
```bash
docker ps -a
```
Shows all containers.

### Stop Container
```bash
docker stop <container-id>
```
Stops a container.

### Start Container
```bash
docker start <container-id>
```
Starts a stopped container.

### Restart Container
```bash
docker restart <container-id>
```
Restarts a container.

### Remove Container
```bash
docker rm <container-id>
```
Removes a stopped container.

### Force Remove Container
```bash
docker rm -f <container-id>
```
Stops and removes a container.

### Remove All Containers
```bash
docker rm -f $(docker ps -aq)
```
Removes all containers.

---

## Accessing Containers

### Open Shell
```bash
docker exec -it <container-id> sh
```
Open shell inside container.

### Open Bash
```bash
docker exec -it <container-id> bash
```
Open bash shell.

### Exit Container Shell
```bash
exit
```
Exits shell and keeps container running.

---

## Logs & Debugging

### View Logs
```bash
docker logs <container-id>
```
Shows logs.

### Follow Logs
```bash
docker logs -f <container-id>
```
Streams logs in real time.

### Inspect Container
```bash
docker inspect <container-id>
```
Shows detailed configuration.

### Resource Usage
```bash
docker stats
```
Shows CPU and memory usage.

---

## Volumes

### Mount Current Folder
```bash
docker run -v $(pwd):/app my-app
```
Shares local files with container.

### List Volumes
```bash
docker volume ls
```
Lists volumes.

### Remove Volume
```bash
docker volume rm <volume-name>
```
Removes a volume.

---

## Networks

### List Networks
```bash
docker network ls
```
Shows available networks.

### Create Network
```bash
docker network create mfe-network
```
Creates custom network.

### Inspect Network
```bash
docker network inspect mfe-network
```
Shows connected containers.

---

## Docker Compose

### Start Services
```bash
docker-compose up
```
Starts all services.

### Build And Start
```bash
docker-compose up --build
```
Builds images and starts services.

### Background Mode
```bash
docker-compose up -d
```
Runs services in background.

### Stop Services
```bash
docker-compose down
```
Stops and removes services.

### Stop And Remove Volumes
```bash
docker-compose down -v
```
Removes volumes too.

### Restart Services
```bash
docker-compose restart
```
Restarts services.

### View Logs
```bash
docker-compose logs
```
Shows logs.

### Follow Logs
```bash
docker-compose logs -f
```
Streams logs.

### List Services
```bash
docker-compose ps
```
Shows compose containers.

---

## Cleanup Commands

### Remove Stopped Containers
```bash
docker container prune -f
```
Deletes stopped containers.

### Remove Unused Resources
```bash
docker system prune -f
```
Removes unused containers, networks and cache.

### Remove Everything
```bash
docker system prune -a --volumes -f
```
Removes all unused images, containers, networks and volumes.

---

## Micro Frontend Commands

### Build Production Image
```bash
docker build -f Dockerfile.prod -t auth-mfe .
```
Creates production image.

### Run Production Container
```bash
docker run -d -p 8080:80 auth-mfe
```
Serves production build via Nginx.

### Start MFE Gateway
```bash
docker-compose up --build
```
Starts Nginx gateway and all MFEs.

### Verify Running Containers
```bash
docker ps
```
Confirms all services are running.
