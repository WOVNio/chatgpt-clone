FROM --platform=linux/amd64  node:18.12.1

WORKDIR /usr/src/app

RUN npm install -g pnpm

COPY package*.json ./
COPY pnpm-lock.yaml ./

RUN pnpm install

COPY . .

EXPOSE 3001

CMD [ "pnpm", "run", "server" ]
