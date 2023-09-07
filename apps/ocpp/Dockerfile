FROM node:18-alpine

COPY package.json .

RUN yarn

COPY . .

# RUN yarn build

EXPOSE 3017
EXPOSE 3021

ENTRYPOINT [ "yarn", "start"]
