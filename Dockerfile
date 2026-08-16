# ── Stage 1: Build the React app ──────────────────────────────
FROM node:18-alpine AS builder

WORKDIR /app

# Build-time public config. Vite inlines VITE_* into the static bundle, so
# this must be present BEFORE `npm run build`. Cloud Build supplies it from
# Secret Manager via --build-arg (see cloudbuild.yaml). Defaults to empty so
# a plain `docker build` still succeeds (Virtual Try-On just stays disabled).
ARG VITE_GEMINI_API_KEY=""
ENV VITE_GEMINI_API_KEY=$VITE_GEMINI_API_KEY

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# ── Stage 2: Serve with Nginx ─────────────────────────────────
FROM nginx:alpine

# Copy the built static assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx config (SPA fallback)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Run as non-root for security
RUN chown -R nginx:nginx /usr/share/nginx/html /var/cache/nginx /var/log/nginx /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown nginx:nginx /var/run/nginx.pid

USER nginx

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q -O /dev/null http://localhost:8080/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
