FROM node:18-alpine

WORKDIR /app
COPY package.json .
RUN yarn install --production

COPY app.js .

EXPOSE 3002
CMD ["node", "app.js"]
