#!/usr/bin/env sh
set -e

if [ -z "$PRODUCTION" ]; then
    echo "Running Caddy in development mode"
    caddy run --config /etc/caddy/Caddyfile.dev --adapter caddyfile
else 
    echo "Running Caddy in production mode"
    caddy run --config /etc/caddy/Caddyfile --adapter caddyfile
fi