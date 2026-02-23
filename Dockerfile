ARG NODE_VERSION="25"
ARG ALPINE_VERSION="3.23"

# === Dependencies ===
FROM dhi.io/node:$NODE_VERSION-alpine$ALPINE_VERSION-dev AS deps

ENV NPM_FLAGS="--ignore-scripts --strict-peer-deps --no-fund"

WORKDIR /files

ADD package*.json .

RUN --mount=type=cache,target=/root/.npm \
    npm ci $NPM_FLAGS

ENV TINI_VERSION=v0.19.0
ADD "https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini-muslc-amd64" /usr/local/bin/tini
RUN chmod +x /usr/local/bin/tini

# === Build ===
FROM deps AS build

ADD . .

RUN npm run build

# === Prod Dependencies ===
FROM deps AS prod-deps

RUN --mount=type=cache,target=/root/.npm \
    npm ci --omit dev $NPM_FLAGS

# Ensure node_modules exists
RUN mkdir -p node_modules

# === Actual app ===
FROM dhi.io/node:$NODE_VERSION-alpine$ALPINE_VERSION

ENV NODE_ENV="production"
LABEL org.opencontainers.image.source=https://github.com/mindpad-eu/mcp

COPY --from=deps /usr/local/bin/tini /usr/local/bin/tini
# COPY --from=busybox:stable-musl /bin/busybox /usr/local/bin/wget

# HEALTHCHECK CMD [ "wget", "-q", "--spider", "--timeout=2", "http://localhost:3000/health" ]

EXPOSE 3000

WORKDIR /app

COPY --from=build /files/package*.json .
COPY --from=prod-deps /files/node_modules ./node_modules
COPY --from=build /files/build ./build
COPY --from=build /files/.env ./.env

VOLUME [ "/tmp" ]
ENTRYPOINT [ "tini", "--", "node", "--env-file=.env", "build/index.js" ]
