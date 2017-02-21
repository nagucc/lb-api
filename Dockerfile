FROM node:6.9.5-alpine

# Copy application files
COPY ./dist /usr/src/app
WORKDIR /usr/src/app

RUN npm install

CMD [ "node", "index.js" ]
