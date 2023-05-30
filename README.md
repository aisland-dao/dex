# Aisland Crosschain Dex
This package is a simple Dex crosschain as you can test from:  
[https://dex.aisland.io](https://dex.aisland.io)  
under the hood, it uses the great [0x protocol](https://0x.org)

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
See  the issues tab, we load the improvements to be done and bugs discovered.
