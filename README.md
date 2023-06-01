# Aisland Crosschain Dex
This package is a Crosschain DEX that is supporting natively 8 different blockchains:
- Ethereum
- Polygon
- Binance Smart Chain
- Optimism
- Fantom 
- Celo 
- Avalanche 
- Arbitrum


You can use the on-line version clicking here:  
[https://dex.aisland.io](https://dex.aisland.io)  

With > 4000 tokens listed.

Under the hood, it uses the great [0x protocol](https://0x.org)  
and the list of tradable tokens is filtered out from [https://tokenlists.org/](https://tokenlists.org/) (an Uniswap Project).  

You can easily make your own DEX with a minimal effort, just changing the logo and colors in a few html/css files inside the html folder.

## Installation Requirements:
Operating System:  
- [Debian/Ubuntu Linux Operating System](https://www.debian.org)  
(it work in any Linux OS with small changes to the installation steps)

Packages to be installed:
- [Nodejs v.20.x](https://nodejs.org). 
- [Mariadb Server](https://mariadb.org).   
- [Nginx](https://www.nginx.com) used as reverse proxy for https connections.  
- [Git](https://git-scm.com)
- [Curl](https://curl.se)

Hardware Requirements:  
4 GB RAM, 10 GB disk for the OS and couple of CPU.  
A virtual machine from any cloud provider will work perfectly.  

## Installation Debian/Ubuntu:
Install Mariadb, Git, Curl and Nginx:
```bash
apt-get -y install mariadb-server git nginx curl
```
The version in the package of the OS is quite old so following the instructions from the official website: [https://nodejs.org](https://nodejs.org) to install the version >= 20.x.  

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
mysql dex <dump.sql  
```
- customise all the files .sh
- configure the Nginx reverse proxy to reach port tcp/3000
- 
## Run
Execute:  

/usr/src/dex-server.sh 

to let it work in background, use systemctl
## Tokens Update
There is an utility to load/update the tokens list reading the data from [https://tokenlists.org/](https://tokenlists.org/).
You should configure the database parameters editing the text file:  
```
dex-load-coingecko-tokens.sh  
```
and launch it from the standard folder:
```
/usr/src/dex/dex-load-coingecko-tokens.sh
```
You should run automatically the app one time a week from crontab. You can add the automatic job with:  
```bash
crontab -e
```
and add the following line:
```bash
15 0 * * 0 /usr/src/dex/dex-load-coingecko-tokens.sh.sh >>/tmp/dex-load-coingecko-tokens.log
```
It will be executed every Sunday at 15 minutes past Midnight

## Tokens Ranking
There is an utility to update the ranking from coingecko api. 
You should configure the database parameters editing the text file:  
```
dex-update-tokens-ranking-coingecko.sh
```
and launch it from the standard folder:
```
/usr/src/dex/dex-update-tokens-ranking-coingecko.sh
```
You should run automatically the app one time a week from crontab. You can add the automatic job with:  
```bash
crontab -e
```
and add the following line:
```bash
0 0 * * 0 /usr/src/dex/dex-update-tokens-ranking-coingecko.sh >>/tmp/dex-update-tokens-ranking-coingecko.log
```
It will be executed every Sunday at Midnight.

## Protocol Fees
You can customise the protocol fees and address to receive them, changing the following variable values in dex.js:  
- buyTokenPercentageFee: 0.001,  
- feeRecipient: '0xbec1Ed0dFc75955486977cc843293fe03ecA657D',  
- affiliateAddress: '0xbec1Ed0dFc75955486977cc843293fe03ecA657D'
You can search for such names using the text editor.
Remember to execute:  
```bash
/usr/srd/dex/build-bundle.sh
to update the bundle.js
```

## Contribution  

- Code contribution are welcome, please feel free to make a pull request.  
- You give a good financial help to make more features, using our public app [https://dex.aisland.io](https://dex.aisland.io), the protocol will forward us 0.1% on the transaction value.  
