#!/bin/bash
# the rpc url of the blockchain to be used
export SUBSTRATECHAIN="wss://mainnet.aisland.io"
export BRIDGEACCOUNT="your_account"
cd /usr/src/dex/server
node /usr/src/dex/server/monitor-balance-dex-wallet.js
