# Stage 1: Build da aplicação
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

# Stage 2: Servir aplicação com Nginx
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuração customizada do nginx (opcional)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expor porta 80
EXPOSE 80

# Comando para iniciar nginx
CMD ["nginx", "-g", "daemon off;"]

