# === Stage 1: Build ===
FROM node:20-alpine AS builder
WORKDIR /app

# 复制 monorepo 配置
COPY package.json package-lock.json* ./
COPY apps/web/package.json ./apps/web/
COPY apps/remotion-studio/package.json ./apps/remotion-studio/
COPY packages/shared/package.json ./packages/shared/
COPY packages/db/package.json ./packages/db/
COPY packages/tts/package.json ./packages/tts/
COPY packages/stickfigure/package.json ./packages/stickfigure/

# 复制所有源码
COPY apps ./apps
COPY packages ./packages

# 安装依赖并构建
RUN npm install
RUN cd apps/web && npm run build

# === Stage 2: Runtime ===
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# 创建非 root 用户
RUN addgroup -g 1001 -S nodejs && adduser -u 1001 -S fable -G nodejs

# 复制构建产物
COPY --from=builder --chown=fable:nodejs /app/apps/web/.next ./apps/web/.next
COPY --from=builder --chown=fable:nodejs /app/apps/web/public ./apps/web/public
COPY --from=builder --chown=fable:nodejs /app/apps/web/package.json ./apps/web/
COPY --from=builder --chown=fable:nodejs /app/apps/web/next.config.js ./apps/web/
COPY --from=builder --chown=fable:nodejs /app/apps/web/src ./apps/web/src
COPY --from=builder --chown=fable:nodejs /app/packages ./packages
COPY --from=builder --chown=fable:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=fable:nodejs /app/package.json ./

# 数据目录
RUN mkdir -p /app/data && chown -R fable:nodejs /app
USER fable

EXPOSE 3000

WORKDIR /app/apps/web

CMD ["npx", "next", "start", "-H", "0.0.0.0", "-p", "3000"]
