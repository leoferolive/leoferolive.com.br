FROM --platform=$BUILDPLATFORM node:20-alpine AS builder
WORKDIR /app

# Build-time variables baked into the static bundle by Vite.
# Override via `--build-arg` in CI; defaults work for a no-arg local build.
ARG VITE_CHAT_API_URL=""
ARG VITE_TURNSTILE_SITE_KEY="1x00000000000000000000AA"

COPY package*.json ./
RUN npm ci

COPY . .

ENV VITE_CHAT_API_URL=$VITE_CHAT_API_URL \
    VITE_TURNSTILE_SITE_KEY=$VITE_TURNSTILE_SITE_KEY

# Bake the build args into .env.production so the RUN layer hash actually
# tracks changes to those values (GHA buildx cache otherwise reuses the
# previous `npm run build` layer regardless of ARG/ENV changes).
RUN printf 'VITE_CHAT_API_URL=%s\nVITE_TURNSTILE_SITE_KEY=%s\n' \
      "$VITE_CHAT_API_URL" "$VITE_TURNSTILE_SITE_KEY" > .env.production && \
    npm run build

FROM nginx:1.27-alpine AS runner
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    touch /var/run/nginx.pid && chown nginx:nginx /var/run/nginx.pid
USER nginx

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
