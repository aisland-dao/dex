// app to monitor a minimum balance on the bridge account
// in case of minimum amount reched the app exits to let the monitoring system rais the alarm
const { ApiPromise, WsProvider } = require('@polkadot/api');
const {BN} =require ('bn.js');
// read env variables
const SUBSTRATECHAIN = process.env.SUBSTRATECHAIN;
if (typeof SUBSTRATECHAIN === 'undefined') {
    console.log(Date.now(), "[Error] the environment variable SUBSTRATECHAIN is not set.");
    process.exit(1);
}

const BRIDGEACCOUNT = process.env.BRIDGEACCOUNT;
if (typeof BRIDGEACCOUNT === 'undefined') {
    console.log(Date.now(), "[Error] the environment variable BRIDGEACCOUNT is not set.");
    process.exit(1);
}

console.log("Balance Monitor ....");
console.log("Account: ",BRIDGEACCOUNT);
mainloop();
// main body
async function mainloop(){
  await check_balance();
  let interval = setInterval(async function () { await check_balance(); }, 120000);

}
async function check_balance(){
    // connect to the substrate Node:
    const wsProvider = new WsProvider(SUBSTRATECHAIN);
    const api = await ApiPromise.create({ provider: wsProvider });
    //check the balance of the bridge
    const account = await api.query.system.account(BRIDGEACCOUNT);
    console.log("Balance of Bridge account "+BRIDGEACCOUNT+ ": ",account.data.free);
    await api.disconnect();
    // check for at the least 1000 tokens available in the account
    const minDeposit = new BN('1000000000000000000000');
    if (account.data.free.lt(minDeposit)) {
            console.log("Balance under minimum amount, exiting....");
            process.exit();
    }
}    