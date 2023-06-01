# Aisland Crosschain Dex
This package is a simple Crosschain DEX. You can check the installed version here:  
[https://dex.aisland.io](https://dex.aisland.io)  

Under the hood, it uses the great [0x protocol](https://0x.org)

## Requirements:
Operating System:  
- [Linux Operating System](https://www.debian.org) (tested on Debian 11, it should work in any another). 
Packages to be installed:
- [Nodejs v.20.x](https://nodejs.org). 
- [Mariadb Server](https://mariadb.org).   
- [Nginx](https://www.nginx.com) used as reverse proxy for https connections.  
- [Git](https://git-scm.com/)

## Installation:
From command line, clone this repository in the folder /usr/src/:  
```bash
 cd /usr/src/  
 git clone https://github.com/aisland-dao/dex/  
```
Install the required packages using npm:  
```bash
npm install  
```
Create a database with:   
```bash
mysql   
create database dex;  
```
create the database tables with:  
```bash
mysql dex <create_tables.sql  
```
- customise all the files .sh
- configure the Nginx reverse proxy to reach port tcp/3000
- 
## Run
Execute:  

/usr/src/dex-server.sh 

to let it work in background, use systemctl

## Update Ranking
There is an utility app to update the ranking from coingecko api. 
You should configure the database parameters editing the text file:  
```
dex-update-tokens-ranking-coingecko.sh
```
and launch it from the standard folder:
```
/usr/src/dex/dex-update-tokens-ranking-coingecko.sh
```
You should run automatically the app one time a week from crontab
