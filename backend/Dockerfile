FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY src/ ./src/

RUN mkdir -p /app/data /app/uploads/listings /app/uploads/blog /app/uploads/logo

EXPOSE 3001

CMD ["node", "src/index.js"]
