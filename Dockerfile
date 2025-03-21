FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

ENV NODE_ENV=development

EXPOSE 3000

CMD npm run start:dev

