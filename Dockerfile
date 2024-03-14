FROM oven/bun:canary-alpine

WORKDIR /usr/local/api

COPY package.json ./
RUN bun install

COPY bun.lockb ./
COPY src ./
COPY tsconfig.json  ./
COPY .env ./

EXPOSE ${SERVER_PORT_DEV}

RUN bun run build
CMD [ "bun", "run", "start:devbuild" ]