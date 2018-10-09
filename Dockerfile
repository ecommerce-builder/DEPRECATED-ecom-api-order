FROM node:alpine

WORKDIR /usr/app

COPY ./package.json  ./
RUN npm install

ADD src ./src

CMD ["npm", "run", "prod-start"]
