#!/bin/sh

$(cat /run/secrets/env_keys) npx dotenvx run -f .env.prod -- node dist/index.js