# backend/Dockerfile
FROM node:18

WORKDIR /app
COPY package*.json ./
RUN npm install

EXPOSE 3030
CMD ["sh", "-c", "npm install && node server.js"]
