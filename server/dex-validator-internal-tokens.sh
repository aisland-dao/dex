#!/bin/bash
export BLOCKCHAIN="wss://mainnet.infura.io/ws/v3/yourcode"
export BLOCKCHAINCODE="1"
export SUBSTRATECHAIN="wss://mainnet.aisland.io"
export TOKENADDRESS="0xdAC17F958D2ee523a2206206994597C13D831ec7"
export WALLETADDRESS="0xa053eB270dA194EB70f614d6B509fC90e0C47F26"
export MNEMONIC="your_mnemonic_seed"
export ABI="/usr/src/dex/server/ABI-USDT.json"
export DBUSER="dex"
export DBPASSWORD="your_password"
export DBHOST="127.0.0.1"
export DBDATABASE="dex"
cd /usr/src/dex/server/
node /usr/src/dex/server/dex-validator-internal-tokens.js