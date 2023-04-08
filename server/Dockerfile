FROM --platform=linux/amd64  node:18.12.1

WORKDIR /usr/src/app

COPY package*.json ./
COPY yarn.lock ./

RUN yarn

COPY . .

EXPOSE 3001

CMD [ "yarn", "start" ]
