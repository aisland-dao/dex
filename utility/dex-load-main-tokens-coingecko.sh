#!/bin/bash
export DB_HOST="localhost"
export DB_NAME="dex"
# this is an username for example,replace with yours
export DB_USER="dex"
# this is a password for example,replace with yours
export DB_PWD="88b9-ea46@8e20-5065*1632"
# fetch the json list
curl https://tokens.coingecko.com/uniswap/all.json >/usr/src/dex/json/dex-load-main-tokens-coingecko.json
# process the list
export JSONFILE=/usr/src/dex/json/dex-load-main-tokens-coingecko.json
node /usr/src/dex/dex-load-tokens-tokenlist.org.js

