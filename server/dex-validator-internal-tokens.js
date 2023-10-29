// Validator to deliver the #AISC or #AISG tokens
const Web3 = require('web3');
const fs = require('fs');
const { ApiPromise, WsProvider } = require('@polkadot/api');
const { Keyring } = require('@polkadot/keyring');
const mysql = require('mysql2/promise');


// GLOBAL VARIABLES
let BLOCKCHAIN;
let BLOCKCHAINCODE;
let SUBSTRATECHAIN;
let MNEMONIC;
let TOKENADDRESS;
let ABI;
let ABIJSON;
let WALLETADDRESS;
let DBUSER;
let DBPASSWORD;
let DBHOST;
let DBDATABASE;
let api;
let client;
let keys;
// execute a main loop for async oeprations
mainloop();
async function mainloop(){
    const ENCRYPTEDCONF = process.env.ENCRYPTEDCONF;
    if (typeof ENCRYPTEDCONF!=='undefined'){
        let fc;
        // read file
        try {
             fc=readFileSync(ENCRYPTEDCONF);
        }catch(e){
            console.log("ERROR reading file",ENCRYPTEDCONF,e);
            return;
        }
        let pwd=prompt("Password to decrypt the configuration:",{echo: ''});
        //decrypt
        let cleartextuint8= await decrypt_symmetric(fc,pwd);
        if(cleartextuint8==false){
            console.log("ERROR: decryption failed, password may be wrong");
            return;
        }
        let cleartext = Buffer.from(cleartextuint8).toString();
        const conf=JSON.parse(cleartext);
        //load the variables from the decrypted json
        TOKENADDRESS = conf.TOKENADDRESS;
        if (typeof TOKENADDRESS==='undefined'){
            console.log("TOKENADDRESS variable is not set, please set it for launching the validator. It's the address of the the token to validate");
            process.exit();
        }
        ABI = conf.ABI;
        if (typeof ABI==='undefined'){
            console.log("ABI variable is not set, please set it for launching the validator. It's the file where to read the ABI of the contract");
            process.exit();
        }
        ABIJSON=fs.readFileSync(ABI,"ascii");
        WALLETADDRESS = conf.WALLETADDRESS;
        if (typeof WALLETADDRESS==='undefined'){
            console.log("WALLETADDRESS variable is not set, please set it for launching the validator. It's the address of the the recipient wallet");
            process.exit();
        }
        BLOCKCHAIN = conf.BLOCKCHAIN;
        if (typeof BLOCKCHAIN==='undefined'){
            console.log("BLOCKCHAIN variable is not set, please set it for launching the validator");
            process.exit();
        }
        BLOCKCHAINCODE = conf.BLOCKCHAINCODE;
        if (typeof BLOCKCHAINCODE==='undefined'){
            console.log("BLOCKCHAINCODE variable is not set, please set it for launching the validator");
            process.exit();
        }
        MNEMONIC = conf.MNEMONIC;
        if (typeof MNEMONIC==='undefined'){
            console.log("MNEMONIC variable is not set, please set it for launching the validator");
            process.exit();
        }
        SUBSTRATECHAIN = conf.SUBSTRATECHAIN;
        if (typeof SUBSTRATECHAIN=='=undefined'){
            console.log("SUBSTRATECHAIN variable is not set, please set it for launching the validator");
            process.exit();
        }
        //database vars
        DBUSER = conf.DBUSER;
        if (typeof DBUSER==='undefined'){
            console.log("DBUSER variable is not set, please set it");
            process.exit();
        }
        DBPASSWORD = conf.DBPASSWORD;
        if (typeof DBPASSWORD==='undefined'){
            console.log("DBPASSWORD variable is not set, please set it");
            process.exit();
        }
        DBHOST = conf.DBHOST;
        if (typeof DBHOST==='undefined'){
            console.log("DBHOST variable is not set, please set it");
            process.exit();
        }
        DBDATABASE = conf.DBDATABASE;
        if (typeof DBDATABASE==='undefined'){
            console.log("DBDATABASE variable is not set, please set it");
            process.exit();
        }
        
    } else {
        //if the encryption configuration is not available, try to load the configuration from from env variables
        TOKENADDRESS = process.env.TOKENADDRESS;
        if (typeof TOKENADDRESS==='undefined'){
            console.log("TOKENADDRESS variable is not set, please set it for launching the validator. It's the address of the the token to validate");
            process.exit();
        }
        ABI = process.env.ABI;
        if (typeof ABI==='undefined'){
            console.log("ABI variable is not set, please set it for launching the validator. It's the file where to read the ABI of the contract");
            process.exit();
        }
        ABIJSON=fs.readFileSync(ABI,"ascii");
        WALLETADDRESS = process.env.WALLETADDRESS;
        if (typeof WALLETADDRESS==='undefined'){
            console.log("WALLETADDRESS variable is not set, please set it for launching the validator. It's the address of the the recipient wallet");
            process.exit();
        }
        BLOCKCHAIN = process.env.BLOCKCHAIN;
        if (typeof BLOCKCHAIN==='undefined'){
            console.log("BLOCKCHAIN variable is not set, please set it for launching the validator");
            process.exit();
        }
        BLOCKCHAINCODE = process.env.BLOCKCHAINCODE;
        if (typeof BLOCKCHAINCODE==='undefined'){
            console.log("BLOCKCHAINCODE variable is not set, please set it for launching the validator");
            process.exit();
        }
        MNEMONIC = process.env.MNEMONIC;
        if (typeof MNEMONIC==='undefined'){
            console.log("MNEMONIC variable is not set, please set it for launching the validator");
            process.exit();
        }
        SUBSTRATECHAIN = process.env.SUBSTRATECHAIN;
        if (typeof SUBSTRATECHAIN=='=undefined'){
            console.log("SUBSTRATECHAIN variable is not set, please set it for launching the validator");
            process.exit();
        }
        //database vars
        DBUSER = process.env.DBUSER;
        if (typeof DBUSER==='undefined'){
            console.log("DBUSER variable is not set, please set it");
            process.exit();
        }
        DBPASSWORD = process.env.DBPASSWORD;
        if (typeof DBPASSWORD==='undefined'){
            console.log("DBPASSWORD variable is not set, please set it");
            process.exit();
        }
        DBHOST = process.env.DBHOST;
        if (typeof DBHOST==='undefined'){
            console.log("DBHOST variable is not set, please set it");
            process.exit();
        }
        DBDATABASE = process.env.DBDATABASE;
        if (typeof DBDATABASE==='undefined'){
            console.log("DBDATABASE variable is not set, please set it");
            process.exit();
        }

    }
    // connect EVM blockchain
    const web3 = new Web3(BLOCKCHAIN || "ws://localhost:8545");
    console.log("Payment Validator v.1.00 - Listening for new events on token ", TOKENADDRESS," for wallet: ",WALLETADDRESS);
    //connect SUBSTRATE CHAIN
    const wsProvider = new WsProvider(SUBSTRATECHAIN);
    api = await ApiPromise.create({ provider: wsProvider });
    const keyring = new Keyring({ type: 'sr25519' });
    keys=keyring.createFromUri(MNEMONIC);
    console.log("Validator Address: ",keys.address);
    // read decimals
    let contract = new web3.eth.Contract(JSON.parse(ABIJSON), TOKENADDRESS);
    const [decimals, symbol] = await Promise.all([
        contract.methods.decimals().call(),
        contract.methods.symbol().call()
    ]);
    console.log("decimals: ",decimals);
    console.log("symbol: ",symbol);
    //subscribe to events to token address
    var subscription = web3.eth.subscribe('logs', {
        address: TOKENADDRESS,
        topics: [web3.utils.sha3('Transfer(address,address,uint256)')]}
        , function(error, result){
        if (error)
            console.log(error);
    }).on("data", async function(event){
    if (event.topics.length == 3) {
        const abi= [{
            type: 'address',
            name: 'from',
            indexed: true
        }, {
            type: 'address',
            name: 'to',
            indexed: true
        }, {
            type: 'uint256',
            name: 'value',
            indexed: false
        }];
        console.log("tx hash: ",event['transactionHash']);
        let transaction = web3.eth.abi.decodeLog(abi,event.data,[event.topics[1], event.topics[2], event.topics[3]]);
        console.log("******************************************");
        console.log("transaction:",transaction);
        console.log("### from:",transaction['from']," to: ",transaction['to']," value: ",transaction['value']);
        let rs;
        if(transaction['to']==WALLETADDRESS) {
            console.log("#######################################");
            console.log("PAYMENT RECEIVED");
            console.log("#######################################");
            // get orderid
            let orderid=1;
            let amount=0;
            //connect to the db
            try {
                client=await opendb();
            }catch(e){	
             console.log("100 - ERROR",e);
             return;
            }
            let recipient;
            let prows;
            let pfields;
            try {
                
                amount=transaction['value'];
                const d=[transaction['from'],TOKENADDRESS,amount];
                const queryText="SELECT * from crosschainpayments where senderaddress=? and fromaddress=? and sellamount=? and dtupdate>DATE_SUB(NOW(), INTERVAL 1 HOUR) and txhashpaymentrec='' order by id desc";
                [prows,pfields] = await client.execute(queryText,d);
                if(prows.length==0){
                    console.log("101 - ERROR order not found",d);
                    await client.end();
                    return;
                }
                recipient=prows[0].recipientaddress;
                console.log("recipient",recipient);
            } catch (e) {
                console.log("102 - ERROR",e);
                await client.end();
                return;
            }
            // compute buy amount on the current exchange rate
            //get exchange rate of selling token
            let stprice=0;
            let stdecimals=18;
            let [rows,fields]=await client.execute("select * from prices where address=?",[prows[0].fromaddress]);
             if(rows.length>0){
               stprice=rows[0].priceusd;
               stdecimals=rows[0].decimals;
             }
             console.log("stprice",stprice);
             console.log("stdecimals",stdecimals);
             let btprice=0;
             let btdecimals=18;
             [rows,fields]=await client.execute("select * from prices where address=?",[prows[0].toaddress]);
             if(rows.length>0){
               btprice=rows[0].priceusd;
               btdecimals=rows[0].decimals;
             }
             console.log("btprice",btprice);
             console.log("btdecimals",stdecimals);
             console.log("prows[0]",prows[0]);
             let sellamountUSD=stprice*prows[0].sellamount/(10 ** stdecimals);
             console.log("sellamountUSD",sellamountUSD);
             console.log("btprice",btprice);
             buyamount=sellamountUSD/btprice *(10 ** btdecimals);
             console.log("buyamount",buyamount);
             //store payment data
             // transfer the funds exchanged to the recipient address
             let txhash= await transferTokens(prows[0].toaddress,buyamount,recipient);
             console.log("txhash",txhash.toHuman());
             // update crosschainpayments table
             let dp=[BLOCKCHAINCODE,event['transactionHash'],txhash.toHuman(),(sellamountUSD/btprice),prows[0].id];
             console.log("dp",dp);
             await client.execute("update crosschainpayments set chainid=?,txhashpaymentrec=?,txhashpaymentsent=?,amountsent=? where id=?",dp);
             await client.end();
             return;
            
        }
    }

    });
}
// function to transfer the token purchased to the recipient
async function transferTokens(token,amount,recipient){
  if(token=='#AISC'){
    try{
       const validate = api.tx.balances.transfer(recipient, BigInt(amount));
       // Sign and send the transaction using our account with nonce to consider the queue
       const hash = await validate.signAndSend(keys,{ nonce: -1 });
       console.log("Validation submitted tx: ",hash.toHex());
       return(hash);
    }catch(e){
      console.log("108 - ERROR",e);
      return;
    }

 }
 
}
// function to open db and return client
async function opendb(){

        client = await mysql.createConnection({
            host     : DBHOST,
            user     : DBUSER,
            password : DBPASSWORD,
            database : DBDATABASE,
            multipleStatements : true
        });
        return(client);
}
