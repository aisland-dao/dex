# Aisland Crosschain Dex
This package is a simple Dex crosschain as you can test from:  
[https://dex.aisland.io](https://dex.aisland.io)

## Requirements:
- Nodejs
- Mariadb Server
- Linux Debian 11
- Nginx as Reverse proxy

## Installation:
Copy in  /usr/src/dex the repo and execute:  
- npm install  
- customisation of the files .sh
- configure the Nginx reverse proxy to reach port tcp/3000
- create database with:   
mysql   
create database dex;  
- create tables with:
mysql dex <create_tables.sql  

## Run
Execute:  

/usr/src/dex-server.sh 

to let it work in background, use systemctl

TODO:
- Allow to change the blockchain 
- Allow to connect wallet fom Swap Button (enable and change text initially)
- check balance of the token before swapping
- check slippage protection + MEV
- improve tokens ranking by additional data like market cap.
- integrate tokens from https://tokenlists.org/token-list?url=https://gateway.ipfs.io/ipns/tokens.uniswap.org
- add Token Metadata from https://coinmarketcap.com/api/documentation/v1/#operation/getV2CryptocurrencyInfo
- filter tokens by blockhain
- add ranking filters
- add trending filters
- add privacy policy
- add condition of use policy







