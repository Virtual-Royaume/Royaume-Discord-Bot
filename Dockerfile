FROM node:19

# Set workdir:
WORKDIR /usr/src/app

# Install required libs for node canvas:
RUN apt-get update && apt-get install -y libuuid1 libgl1-mesa-dev

# Install deps:
COPY package*.json ./
RUN npm install

# Copy all files:
COPY . .

CMD npm run start