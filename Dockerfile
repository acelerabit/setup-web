FROM node:18 AS build
WORKDIR /usr/src/app

COPY  package.json yarn.lock ./

RUN yarn

COPY . .

RUN yarn run build

EXPOSE 3000

CMD ["yarn", "start"]