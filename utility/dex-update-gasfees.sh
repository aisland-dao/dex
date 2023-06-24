#!/bin/bash
export DB_HOST="localhost"
export DB_NAME="dex"
export DB_USER="dex"
# SET YOUR PASSWORD DB
export DB_PWD="..."
# GET THE API KEY FROM https://polygonscan.com and
export APIKEY="...."
node /usr/src/dex/utility/dex-update-gasfees.js

