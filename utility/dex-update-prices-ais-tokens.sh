#!/bin/bash
export DB_HOST="localhost"
export DB_NAME="dex"
export DB_USER="dex"
export DB_PWD="yourpassword"
node /usr/src/dex/utility/dex-update-prices-ais-tokens.js

