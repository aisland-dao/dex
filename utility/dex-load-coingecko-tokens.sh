#!/bin/bash
export DB_HOST="localhost"
export DB_NAME="dex"
export DB_USER="dex"
export DB_PWD="88b9-ea46@8e20-5065*1632"
#curl -X 'GET'  'https://api.coingecko.com/api/v3/coins/list?include_platform=true'  -H 'accept: application/json' >/usr/src/dex/json/coingeckocoinslist.json
node /usr/src/dex/dex-load-coingecko-tokens.js

