FROM node:20-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY prisma ./prisma
RUN npx prisma generate

COPY . .

RUN pnpm build

EXPOSE 3001

CMD ["node", "dist/index.js"]
