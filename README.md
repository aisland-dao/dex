# Aisland Crosschain Dex
This package is a simple Dex crosschain. You can check the installed version here:  
[https://dex.aisland.io](https://dex.aisland.io)  

Under the hood, it uses the great [0x protocol](https://0x.org)

## Requirements:
Operating System:  
- [Linux Operating System](https://www.debian.org) (tested on Debian 11, it should work in another). 
Packages:  
- [Nodejs v.20.x](https://nodejs.org). 
- [Mariadb Server](https://mariadb.org).   
- [Nginx](https://www.nginx.com) used as reverse proxy for https connections.  

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
