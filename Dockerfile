FROM node:16.16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

CMD npm run build && npm run start