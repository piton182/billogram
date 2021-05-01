FROM node:14-alpine

COPY package.json ./
COPY package-lock.json ./
COPY bin ./bin
COPY lib ./lib
COPY routes ./routes
COPY app.js ./

RUN npm install
RUN ls

EXPOSE 80

CMD ["npm", "run", "start"]