ARG NODE_VERSION=20.17.0

FROM node:${NODE_VERSION}-alpine as base
WORKDIR /usr/src/app
EXPOSE 3000

FROM base as dev
COPY package*.json ./
RUN npm i 
COPY . .
CMD npm run start

FROM base as prod
COPY package*.json ./
RUN npm i
COPY . .
CMD npm run start:prod

FROM base as test
ENV NODE_ENV test
COPY package*.json ./
RUN npm i
COPY . .
RUN npm run test