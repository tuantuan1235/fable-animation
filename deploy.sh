#!/bin/bash
set -e

echo "======================================"
echo "  火柴人寓言 - 阿里云一键部署脚本"
echo "======================================"

if ! command -v docker &> /dev/null; then
    echo ">>> 安装 Docker..."
    curl -fsSL https://get.docker.com | sh
    systemctl start docker
    systemctl enable docker
    echo "Docker 安装完成"
fi

if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo ">>> 安装 Docker Compose..."
    curl -SL https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64 -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    echo "Docker Compose 安装完成"
fi

if [ ! -f .env ]; then
    echo ">>> 创建 .env 配置文件..."
    cp .env.example .env
    echo "请编辑 .env 文件，填入 MiniMax API 密钥后重新运行此脚本"
    echo "  vim .env"
    exit 1
fi

source .env
if [ "$MINIMAX_API_KEY" = "your_api_key_here" ]; then
    echo "错误：请先在 .env 文件中填入真实的 MiniMax API Key"
    exit 1
fi

echo ">>> 构建并启动服务..."
if docker compose version &> /dev/null; then
    docker compose up -d --build
else
    docker-compose up -d --build
fi

echo ""
echo "======================================"
echo "  部署完成！"
echo "======================================"
echo ""
echo "  访问地址: http://$(hostname -I | awk '{print $1}')"
echo "  或者使用公网 IP: http://YOUR_PUBLIC_IP"
echo ""
echo "  常用命令:"
echo "    查看日志: docker compose logs -f"
echo "    停止服务: docker compose down"
echo "    重启服务: docker compose restart"
echo "======================================"
