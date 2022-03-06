#!/usr/bin/env bash

set -e

npx playwright install --with-deps
yarn next build
LEFFAAN_MODE=test yarn next start &
yarn playwright test
kill -9 $(lsof -ti:3000)
