ARG IMAGE=node:17.8
FROM $IMAGE

WORKDIR /backend

ADD . .

RUN npm install

CMD [ "npm", "run", "start" ]
