#!/bin/bash
## ATTENTION set your database data to connect
export DB_HOST="localhost"
export DB_NAME="dex"
export DB_USER="..."
export DB_PWD="...."
# DOWNLODAD THE MARKET CAP LIST FROM COINGECO USING FREE API 
curl -X 'GET'  'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false&price_change_percentage=24h&locale=en' -H 'accept: application/json'
node /usr/src/dex/dex-update-tokens-ranking-coingecko.js

