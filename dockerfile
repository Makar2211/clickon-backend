FROM node:21

WORKDIR /app

COPY package.json package-lock.json ./
# COPY .env .env
# COPY config.ts /app/src/prisma/config.ts

# RUN npm install
RUN npm i

COPY . .

# RUN npx prisma db pull

RUN npx prisma generate

RUN npm run build

EXPOSE 1616

CMD ["npm", "run", "start:prod"]