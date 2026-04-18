FROM oven/bun:1.3-slim

WORKDIR /app

COPY package.json bun.lock* ./

RUN bun install

COPY . .

EXPOSE 8003

CMD bun start