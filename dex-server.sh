#!/bin/bash
# Api Key from https://0x.org
export APIKEY=".."
# the connection data to your Mariadb server (or Mysql Server), please change it accordingly to your configuration.
export DB_HOST="localhost"
export DB_NAME=".."
export DB_USER=".."
export DB_PWD=".."
# we assume the package is in /usr/src/dex, if you want to change directory, change it below:
cd /usr/src/dex/
node /usr/src/dex/dex-server.js
