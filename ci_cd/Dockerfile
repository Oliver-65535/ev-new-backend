FROM node:19.8.1-alpine as builder
ARG CI_COMMIT_REF_NAME
ARG VAULT_ADDR
ARG VAULT_TOKEN
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

COPY . .

RUN node vault_data_to_json.ts token="$VAULT_TOKEN" url="$VAULT_ADDR" root_path="archon" name="keys"
RUN yarn build api-gateway
RUN yarn build article-api
RUN yarn build auth
RUN yarn build file-store

           
FROM node:19.8.1-alpine as executor
WORKDIR /app

COPY --from=builder /app .