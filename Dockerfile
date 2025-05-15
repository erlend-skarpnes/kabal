FROM node:23.9.0-alpine AS builder
WORKDIR /app

COPY yarn.lock package.json ./

RUN yarn install

COPY . .

RUN yarn build

FROM nginx:1.28.0-alpine-slim
COPY --from=builder /app/dist /usr/share/nginx/html