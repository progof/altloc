FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
ARG VITE_PUBLIC_CDN_URL
ENV VITE_PUBLIC_CDN_URL=http://cdn.altloc.com:9000/altloc/
ARG VITE_APP_NAME
ENV VITE_APP_NAME=$VITE_APP_NAME
ARG VITE_MEDIA_TWITTER
ENV VITE_MEDIA_TWITTER=$VITE_MEDIA_TWITTER
ARG VITE_MEDIA_INSTAGRAM
ENV VITE_MEDIA_INSTAGRAM=$VITE_MEDIA_INSTAGRAM
ARG VITE_MEDIA_FACEBOOK
ENV VITE_MEDIA_FACEBOOK=$VITE_MEDIA_FACEBOOK
ARG VITE_MEDIA_TELEGRAM
ENV VITE_MEDIA_TELEGRAM=$VITE_MEDIA_TELEGRAM
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

FROM nginx:stable-alpine AS frontend
COPY .nginx/nginx.conf /etc/nginx/nginx.conf
COPY .nginx/altloc.com /etc/nginx/sites-available/altloc.com
COPY --from=build /usr/src/app/frontend/dist /usr/share/nginx/html
WORKDIR /usr/share/nginx/html
EXPOSE 80
EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]
