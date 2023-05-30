#!/bin/bash
# execute this script if you change dex.js, it will create the updated bundle.js
# you have to change the path if you did not use the standard one: /usr/src/dex
browserify /usr/src/dex/html/js/dex.js --standalone bundle -o /usr/src/dex/html/js/bundle.js
