ARG NODE_VERSION=21.7.3
FROM node:${NODE_VERSION}-alpine AS build-stage

RUN apk --no-cache add dumb-init
RUN mkdir -p /home/node/app && chown -R node:node /home/node/app
WORKDIR /home/node/app

USER node

FROM build-stage AS dependencies
COPY --chown=node:node package.json package-lock.json ./
RUN npm install
COPY --chown=node:node . .

FROM dependencies AS build
RUN npm run build --ignore-ts-errors

FROM node:${NODE_VERSION}-alpine AS production

RUN apk --no-cache add dumb-init
RUN mkdir -p /home/node/app && chown -R node:node /home/node/app
WORKDIR /home/node/app

USER node

# 1. Copier package.json et installer production
COPY --chown=node:node package.json package-lock.json ./
RUN npm install --omit=dev

# 2. Copier le build
COPY --chown=node:node --from=build /home/node/app/dist ./dist

# 3. Copier prisma
COPY --chown=node:node prisma ./prisma

# 4. Copier .env (LE PLUS IMPORTANT)
COPY --chown=node:node .env .env

# 5. Générer le client Prisma
RUN npx prisma generate

EXPOSE $PORT

CMD ["dumb-init", "node", "dist/src/main.js"]
