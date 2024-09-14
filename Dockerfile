FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run -r build
RUN pnpm --filter=backend --prod deploy /prod/backend
RUN pnpm --filter=frontend --prod deploy /prod/frontend

FROM base AS backend
COPY --from=build /prod/backend /prod/backend
WORKDIR /prod/backend
ENV APP_PORT=4000
EXPOSE 4000
CMD ["pnpm", "start"]

FROM caddy:latest AS frontend
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build /prod/frontend /prod/frontend 
WORKDIR /prod/frontend
EXPOSE 80