#!/bin/bash
export DB_HOST="localhost"
export DB_NAME="dex"
export DB_USER=".."
export DB_PWD=".."
curl https://tokens.coingecko.com/uniswap/all.json >/usr/src/dex/json/tokens-uniswap.json
node /usr/src/dex/dex-load-main-tokens-coingecko.js

