FROM node:12

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build
COPY .env ./dist/

WORKDIR /app/dist

ENV PORT=3000

EXPOSE 3000

CMD ["npm", "run", "run"]