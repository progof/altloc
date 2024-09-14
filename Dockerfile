FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
ARG VITE_PUBLIC_CDN_URL
ENV VITE_PUBLIC_CDN_URL=$VITE_PUBLIC_CDN_URL
RUN pnpm run -r build
RUN pnpm --filter=backend --prod deploy /prod/backend

FROM base AS backend
COPY --from=build /prod/backend/dist /prod/backend/dist
COPY --from=build /prod/backend/node_modules /prod/backend/node_modules
COPY --from=build /prod/backend/package.json /prod/backend/package.json
COPY --from=build /prod/backend/db/migrations /prod/backend/db/migrations
WORKDIR /prod/backend
ENV APP_PORT=4000
EXPOSE 4000
CMD ["pnpm", "start"]

FROM nginx:latest AS frontend
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/frontend/dist /usr/share/nginx/html
WORKDIR /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]