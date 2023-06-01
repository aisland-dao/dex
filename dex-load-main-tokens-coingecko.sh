#!/bin/bash
export DB_HOST="localhost"
export DB_NAME="dex"
export DB_USER="dex"
export DB_PWD="88b9-ea46@8e20-5065*1632"
curl https://tokens.coingecko.com/uniswap/all.json >/usr/src/dex/json/tokens-uniswap.json
node /usr/src/dex/dex-load-main-tokens-coingecko.js

