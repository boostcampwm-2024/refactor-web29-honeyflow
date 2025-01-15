FROM node:20-alpine AS builder

WORKDIR /app

RUN apk add --no-cache python3 make g++ && npm install -g pnpm
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY ./packages/backend ./packages/backend/
COPY ./packages/shared ./packages/shared/

RUN HUSKY=0 pnpm install --frozen-lockfile

RUN cd ./packages/backend && pnpm build

FROM node:20-alpine AS production

WORKDIR /app

COPY --from=builder /app .

WORKDIR /app/packages/backend

EXPOSE 3000

CMD ["node", "dist/main"]