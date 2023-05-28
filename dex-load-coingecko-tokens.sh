#!/bin/bash
export DB_HOST="localhost"
export DB_NAME=".."
export DB_USER=".."
export DB_PWD="....-ea46@8e20-5065*1632"
#curl -X 'GET'  'https://api.coingecko.com/api/v3/coins/list?include_platform=true'  -H 'accept: application/json' >/usr/src/dex/json/coingeckocoinslist.json
node /usr/src/dex/dex-load-coingecko-tokens.js

