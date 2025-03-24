FROM node:23-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm install

COPY . .

EXPOSE 500[0

CMD ["node", "server.js"]