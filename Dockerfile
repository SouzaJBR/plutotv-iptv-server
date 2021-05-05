#
# Build container
#

FROM node:15-alpine as builder


WORKDIR /usr/src/app

# Install dependencies
COPY package*.json yarn.lock ./
COPY tsconfig*.json .
RUN yarn install --frozen-lockfile

# Copy app files
COPY . .

RUN npm run build

#
# Production container
#

FROM node:15-alpine

ENV NODE_ENV production

RUN yarn global add pm2

WORKDIR /usr/src/app
RUN chown node:node .
USER node

# Install dependencies and transpiled files
COPY package*.json .
RUN npm install
COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3000

CMD pm2-runtime dist/server.js