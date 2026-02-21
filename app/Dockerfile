FROM node:18-alpine

WORKDIR /app
COPY package.json .
RUN yarn install --production

COPY app.js .
COPY public/ public/

EXPOSE 3002
CMD ["node", "app.js"]
