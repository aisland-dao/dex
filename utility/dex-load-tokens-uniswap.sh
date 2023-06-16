#!/bin/bash
export DB_HOST="localhost"
export DB_NAME="dex"
# this is an username for example,replace with yours
export DB_USER="dex"
# this is a password for example,replace with yours
export DB_PWD="88b9-ea46@8e20-5065*1632"
# fetch the list in json format
curl https://gateway.ipfs.io/ipns/tokens.uniswap.org >/usr/src/dex/json/dex-load-tokens-uniswap.json
# process the list imported
export JSONFILE=/usr/src/dex/json/dex-load-tokens-uniswap.json
node /usr/src/dex/dex-load-tokens-tokenlist.org.js

