# Docker常用命令指南

## 1. 基础命令

### Docker环境信息

```bash
# 查看Docker版本信息
docker version

# 查看Docker系统信息
docker info

# 查看Docker磁盘使用情况
docker system df

# 清理未使用的Docker资源
docker system prune
```

### 镜像管理

```bash
# 列出所有镜像
docker images

# 拉取镜像
docker pull <image_name>:<tag>

# 删除镜像
docker rmi <image_id>

# 构建镜像
docker build -t <image_name>:<tag> .

# 查看镜像历史
docker history <image_id>

# 保存镜像到文件
docker save -o <filename>.tar <image_name>:<tag>

# 从文件加载镜像
docker load -i <filename>.tar
```

### 容器管理

```bash
# 列出所有运行中的容器
docker ps

# 列出所有容器（包括停止的）
docker ps -a

# 运行容器
docker run [options] <image_name>

# 启动容器
docker start <container_id>

# 停止容器
docker stop <container_id>

# 重启容器
docker restart <container_id>

# 强制停止容器
docker kill <container_id>

# 删除容器
docker rm <container_id>

# 进入容器
docker exec -it <container_id> /bin/bash

# 查看容器日志
docker logs <container_id>

# 实时查看容器日志
docker logs -f <container_id>

# 查看容器详情
docker inspect <container_id>

# 查看容器资源使用情况
docker stats <container_id>
```

### 网络管理

```bash
# 列出所有网络
docker network ls

# 创建网络
docker network create <network_name>

# 删除网络
docker network rm <network_name>

# 查看网络详情
docker network inspect <network_name>

# 连接容器到网络
docker network connect <network_name> <container_id>

# 断开容器网络连接
docker network disconnect <network_name> <container_id>
```

### 数据卷管理

```bash
# 列出所有数据卷
docker volume ls

# 创建数据卷
docker volume create <volume_name>

# 删除数据卷
docker volume rm <volume_name>

# 查看数据卷详情
docker volume inspect <volume_name>

# 删除未使用的数据卷
docker volume prune
```

## 2. 中间件部署

### MySQL部署

```bash
# 启动MySQL容器
docker run -d \
  --name mysql-container \
  -e MYSQL_ROOT_PASSWORD=rootpassword \
  -e MYSQL_DATABASE=mydb \
  -e MYSQL_USER=user \
  -e MYSQL_PASSWORD=password \
  -p 3306:3306 \
  -v mysql-data:/var/lib/mysql \
  mysql:8.0

# 连接MySQL
docker exec -it mysql-container mysql -u user -p

# 导出数据库
docker exec mysql-container mysqldump -u user -p mydb > backup.sql

# 导入数据库
docker exec -i mysql-container mysql -u user -p mydb < backup.sql
```

### Redis部署

```bash
# 启动Redis容器
docker run -d \
  --name redis-container \
  -p 6379:6379 \
  -v redis-data:/data \
  redis:7.0 \
  redis-server --appendonly yes

# 连接Redis
docker exec -it redis-container redis-cli

# Redis数据备份
docker exec redis-container redis-cli BGSAVE
```

### PostgreSQL部署

```bash
# 启动PostgreSQL容器
docker run -d \
  --name postgres-container \
  -e POSTGRES_DB=mydb \
  -e POSTGRES_USER=user \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -v postgres-data:/var/lib/postgresql/data \
  postgres:13

# 连接PostgreSQL
docker exec -it postgres-container psql -U user -d mydb

# 导出PostgreSQL数据库
docker exec postgres-container pg_dump -U user mydb > backup.sql

# 导入PostgreSQL数据库
docker exec -i postgres-container psql -U user -d mydb < backup.sql
```

### MongoDB部署

```bash
# 启动MongoDB容器
docker run -d \
  --name mongo-container \
  -e MONGO_INITDB_ROOT_USERNAME=user \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  -p 27017:27017 \
  -v mongo-data:/data/db \
  mongo:5.0

# 连接MongoDB
docker exec -it mongo-container mongosh -u user -p

# MongoDB备份
docker exec mongo-container mongodump --username user --password password --out /tmp/backup

# MongoDB恢复
docker exec mongo-container mongorestore --username user --password password /tmp/backup
```

### Elasticsearch部署

```bash
# 启动Elasticsearch容器
docker run -d \
  --name elasticsearch-container \
  -p 9200:9200 \
  -p 9300:9300 \
  -e "discovery.type=single-node" \
  -e "xpack.security.enabled=false" \
  -e "path.repo=/usr/share/elasticsearch/backup_temp" \
  -v elasticsearch-data:/usr/share/elasticsearch/data \
  docker.elastic.co/elasticsearch/elasticsearch:8.11.0

# 查看Elasticsearch状态
curl http://localhost:9200/_cluster/health?pretty

# 创建快照仓库
curl -X PUT "localhost:9200/_snapshot/my_backup" -H 'Content-Type: application/json' -d'
{
  "type": "fs",
  "settings": {
    "location": "/usr/share/elasticsearch/backup_temp"
  }
}'
```

## 3. 服务备份与恢复

### 备份策略

```bash
# 创建备份脚本
cat > backup-script.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)

# MySQL备份
docker exec mysql-container mysqldump -u user -p mydb > /backup/mysql_backup_$DATE.sql

# Redis备份
docker exec redis-container redis-cli SAVE
docker cp redis-container:/data/dump.rdb /backup/redis_backup_$DATE.rdb

# MongoDB备份
docker exec mongo-container mongodump --username user --password password --out /backup/mongo_backup_$DATE

# PostgreSQL备份
docker exec postgres-container pg_dump -U user mydb > /backup/postgres_backup_$DATE.sql
EOF

chmod +x backup-script.sh
```

### 定时备份（使用crontab）

```bash
# 编辑crontab
crontab -e

# 添加定时备份任务（每天凌晨2点执行）
0 2 * * * /path/to/backup-script.sh

# 查看当前crontab
crontab -l
```

### 数据恢复

```bash
# 从备份恢复MySQL
docker exec -i mysql-container mysql -u user -p mydb < backup.sql

# 恢复Redis数据
docker cp backup.rdb redis-container:/data/dump.rdb
docker restart redis-container

# 恢复MongoDB数据
docker exec -i mongo-container mongorestore --username user --password password /backup/mongo_backup

# 恢复PostgreSQL数据
docker exec -i postgres-container psql -U user -d mydb < backup.sql
```

## 4. Java应用部署

### Spring Boot应用部署

```bash
# Dockerfile示例
cat > Dockerfile << 'EOF'
FROM openjdk:17-jre-slim
VOLUME /tmp
COPY target/myapp.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
EOF

# 构建镜像
docker build -t myapp:latest .

# 运行Spring Boot应用
docker run -d \
  --name spring-boot-app \
  -p 8080:8080 \
  -e SPRING_PROFILES_ACTIVE=prod \
  myapp:latest
```

### Tomcat部署

```bash
# 运行Tomcat容器
docker run -d \
  --name tomcat-container \
  -p 8080:8080 \
  -v $(pwd)/webapps:/usr/local/tomcat/webapps \
  tomcat:9.0

# 部署WAR包
docker cp myapp.war tomcat-container:/usr/local/tomcat/webapps/
```

### Java应用调试

```bash
# 查看Java应用日志
docker logs -f spring-boot-app

# 进入Java容器
docker exec -it spring-boot-app /bin/bash

# 查看Java进程
docker exec spring-boot-app jps

# 获取heap dump
docker exec spring-boot-app jmap -dump:format=b,file=heap.hprof <pid>
```

## 5. Python应用部署

### Flask应用部署

```bash
# Dockerfile示例
cat > Dockerfile << 'EOF'
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]
EOF

# 构建并运行
docker build -t flask-app .
docker run -d --name flask-container -p 5000:5000 flask-app
```

### Django应用部署

```bash
# 运行Django应用
docker run -d \
  --name django-container \
  -p 8000:8000 \
  -v $(pwd)/static:/app/static \
  -e DJANGO_SETTINGS_MODULE=settings.production \
  django-app:latest

# Django迁移命令
docker exec django-container python manage.py migrate

# 创建超级用户
docker exec -it django-container python manage.py createsuperuser
```

## 6. Node.js应用部署

### Node.js应用部署

```bash
# Dockerfile示例
cat > Dockerfile << 'EOF'
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
EOF

# 构建并运行
docker build -t node-app .
docker run -d --name node-container -p 3000:3000 node-app
```

### Nginx代理Node.js应用

```bash
# Nginx配置
cat > nginx.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    upstream node_app {
        server node-container:3000;
    }

    server {
        listen 80;

        location / {
            proxy_pass http://node_app;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
}
EOF

# 运行Nginx代理
docker run -d \
  --name nginx-proxy \
  --network container:node-container \
  -p 80:80 \
  -v $(pwd)/nginx.conf:/etc/nginx/nginx.conf:ro \
  nginx:alpine
```

## 7. Docker Compose管理

### 常用Compose命令

```bash
# 启动服务
docker-compose up -d

# 停止服务
docker-compose down

# 重启服务
docker-compose restart

# 查看服务状态
docker-compose ps

# 查看服务日志
docker-compose logs

# 实时查看服务日志
docker-compose logs -f

# 扩展服务实例
docker-compose up --scale service_name=3

# 重新构建并启动
docker-compose up --build

# 仅构建服务
docker-compose build

# 在特定服务中执行命令
docker-compose exec service_name command
```

### Compose文件示例

```yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "8000:8000"
    depends_on:
      - db
      - redis
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/mydb
      - REDIS_URL=redis://redis:6379
  
  db:
    image: postgres:13
    environment:
      POSTGRES_DB: mydb
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
  
  redis:
    image: redis:7.0-alpine
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

## 8. Docker Swarm集群管理

### 初始化Swarm

```bash
# 初始化Swarm集群
docker swarm init --advertise-addr <MANAGER-IP>

# 获取加入令牌
docker swarm join-token worker
docker swarm join-token manager

# 查看节点
docker node ls

# 将节点标记为维护模式
docker node update --availability drain <NODE-ID>

# 退出Swarm
docker swarm leave
```

### 服务管理

```bash
# 创建服务
docker service create --name my-service nginx

# 查看服务
docker service ls

# 查看服务详情
docker service ps my-service

# 扩展服务
docker service scale my-service=3

# 更新服务
docker service update --image nginx:latest my-service

# 删除服务
docker service rm my-service

# 滚动更新
docker service update --image nginx:latest --update-parallelism 1 --update-delay 10s my-service
```

### Stack部署

```bash
# 部署Stack
docker stack deploy -c docker-compose.yml mystack

# 查看Stack
docker stack ls

# 查看Stack中的服务
docker stack services mystack

# 查看Stack中的任务
docker stack ps mystack

# 删除Stack
docker stack rm mystack
```

## 9. 安全与监控

### 安全最佳实践

```bash
# 以非root用户运行容器
docker run --user 1000:1000 myapp

# 限制容器资源
docker run -m 512m --cpus=1.0 myapp

# 只读根文件系统
docker run --read-only myapp

# 不可变容器
docker run --read-only --tmpfs /tmp myapp
```

### 监控命令

```bash
# 查看所有容器资源使用情况
docker stats

# 查看特定容器资源使用情况
docker stats <container_id>

# 查看容器事件
docker events

# 查看系统事件
docker system events
```

## 10. 故障排除

### 常见问题排查

```bash
# 查看容器内部进程
docker top <container_id>

# 查看容器端口映射
docker port <container_id>

# 在运行中的容器中执行命令
docker exec <container_id> command

# 复制文件到容器
docker cp host_file <container_id>:/path/in/container

# 从容器复制文件
docker cp <container_id>:/path/in/container host_file

# 查看容器变更
docker diff <container_id>

# 重新启动失败的容器
docker restart <container_id>

# 查看容器资源限制
docker inspect <container_id> | grep -i memory
```

### 日志分析

```bash
# 查看最近的日志
docker logs --since 1h <container_id>

# 查看最后N行日志
docker logs --tail 100 <container_id>

# 按时间排序日志
docker logs --timestamps <container_id>
```

## 11. 性能优化

### 优化技巧

```bash
# 多阶段构建减少镜像大小
docker build --target production -t myapp:prod .

# 清理未使用的镜像、容器和网络
docker system prune -a

# 查找最大的镜像
docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}" | sort -k 3 -hr

# 优化容器启动时间
docker run --init myapp
```

### 资源限制

```bash
# 限制内存使用
docker run -m 512m myapp

# 限制CPU使用
docker run --cpus=0.5 myapp

# 限制磁盘IO
docker run --blkio-weight=100 myapp
```

## 12. 实用脚本

### 一键部署脚本

```bash
#!/bin/bash
# deploy.sh

# 检查Docker是否运行
if ! docker info > /dev/null 2>&1; then
    echo "Docker服务未运行，请先启动Docker"
    exit 1
fi

# 构建应用
echo "构建应用..."
docker build -t myapp:latest .

# 停止旧容器
docker stop myapp-container 2>/dev/null || true
docker rm myapp-container 2>/dev/null || true

# 启动新容器
echo "启动应用..."
docker run -d \
  --name myapp-container \
  -p 8080:8080 \
  -v myapp-data:/app/data \
  myapp:latest

echo "应用部署完成！访问 http://localhost:8080"
```

### 清理脚本

```bash
#!/bin/bash
# cleanup.sh

echo "清理停止的容器..."
docker container prune -f

echo "清理未使用的镜像..."
docker image prune -f

echo "清理未使用的数据卷..."
docker volume prune -f

echo "清理未使用的网络..."
docker network prune -f

echo "清理所有未使用的资源..."
docker system prune -f
```

这个指南涵盖了Docker在实际开发和运维中的常见应用场景，希望能帮助您更好地管理容器化应用。