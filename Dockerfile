FROM node:19-alpine

# Set workdir:
WORKDIR /usr/src/app

# Install required libs for node canvas:
RUN apk add --update libuuid libgl

# Install deps:
COPY package*.json ./
RUN npm install

# Copy all files:
COPY . .

CMD npm run start