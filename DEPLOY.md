# 寓言动画创作平台 - 部署指南

## 服务器要求

- Docker 20.10+
- Docker Compose v2
- 至少 2GB 内存

## 部署步骤

### 1. 拉取代码

```bash
git clone https://github.com/tuantuan1235/fable-animation.git
cd fable-animation
```

### 2. 配置环境变量（可选）

```bash
cp .env.example .env
# 编辑 .env 填入你的 MiniMax API Key
```

### 3. 启动服务

```bash
docker compose up -d --build
```

### 4. 查看日志

```bash
docker compose logs -f fable-web
```

### 5. 访问

打开浏览器访问 `http://服务器IP:3000`

## 常用命令

```bash
# 停止服务
docker compose down

# 重启服务
docker compose restart

# 查看运行状态
docker compose ps

# 进入容器
docker compose exec fable-web sh

# 查看数据卷
docker volume inspect fable-animation_fable-data
```

## 数据持久化

- SQLite 数据库文件位于命名卷 `fable-animation_fable-data`
- 即使容器删除，数据依然保留

## 更新代码

```bash
cd fable-animation
git pull
docker compose up -d --build
```

## 反向代理（可选）

如需在 80/443 端口提供服务，建议使用 Nginx 或 Caddy 反向代理。示例 Nginx 配置：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    client_max_body_size 100M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```
