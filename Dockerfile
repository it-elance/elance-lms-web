FROM node:22-alpine AS base
WORKDIR /app

# HUSKY=0: no git hooks to install inside the image
ENV HUSKY=0
COPY package.json yarn.lock .npmrc ./
RUN yarn install --frozen-lockfile

# Dev: docker-compose.dev.yml mounts the code at /app, and next dev reloads on every change
FROM base AS dev
EXPOSE 3000
CMD ["yarn", "dev", "-p", "3012"]

# Production (the default target)
FROM base AS prod
COPY . .

# Builds with the NEXT_PUBLIC_* values in this repo's .env
RUN yarn build

EXPOSE 3000
CMD ["yarn", "start", "-p", "3000"]
