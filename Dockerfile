FROM node:22-alpine

WORKDIR /app 
COPY package*.json ./
RUN npm install 
COPY . .
EXPOSE 4004
CMD [ "node","server.js" ]

# docker run -d --name boring_hamilton --network food-network -e PORT=4004 -p 4004:4004 online_food_ordering