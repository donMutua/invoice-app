ARG NODE_VERSION=18-alpine

FROM node:${NODE_VERSION}

ARG APP_HOME=/app

WORKDIR ${APP_HOME}

COPY package*.json ./
COPY tsconfig.json ./

RUN npm install -g pnpm
RUN pnpm install

COPY . ${APP_HOME}

EXPOSE 8080 443

CMD ["pnpm","run", "dev"]

