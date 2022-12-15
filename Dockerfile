FROM node:17.8

WORKDIR /backend

ADD . .

RUN npm install

CMD [ "npm", "run", "start" ]
