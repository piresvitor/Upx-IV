FROM node:20-alpine AS builder 

WORKDIR /app

COPY . .

RUN npm ci --only=production

EXPOSE 3333

CMD ["node", "src/server.ts"]