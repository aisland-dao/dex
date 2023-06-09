// Dex Server - It allows to fetch static files and API
let express = require('express');
let fs=require("fs");
const path = require('path')
const qs=require("qs");
let mysql = require('mysql2/promise');

let app = express();
// get API KEY for 0x.0rg
const APIKEY = process.env.APIKEY
if (typeof APIKEY === 'undefined') {
    console.log(Date.now(), "[Error] the environment variable APIKEY is not set.");
    process.exit(1);
}
// get API KEY for Coinmarketcap.com
const COINMARKETCAPAPIKEY=process.env.COINMARKETCAPAPIKEY; //optional
if (typeof COINMARKETCAPAPIKEY=== 'undefined') {
    console.log(Date.now(), "[Error] the environment variable COINMARKETCAPAPIKEY is not set.");
    process.exit(1);
}
const DB_HOST = process.env.DB_HOST
const DB_NAME = process.env.DB_NAME
const DB_USER = process.env.DB_USER
const DB_PWD = process.env.DB_PWD
const WALLET = process.env.WALLET
const FEES=process.env.FEES;

// set default to local host if not set
if (typeof DB_HOST === 'undefined') {
    console.log(Date.now(), "[Error] the environment variable DB_HOST is not set.");
    process.exit(1);
}
if (typeof DB_NAME === 'undefined') {
    console.log(Date.now(), "[Error] the environment variable DB_NAME is not set.");
    process.exit(1);
}
// DB_USER is mandatory
if (typeof DB_USER === 'undefined') {
    console.log(Date.now(), "[Error] the environment variable DB_USER is not set.");
    process.exit(1);
}
// DB_PWD is mandatory
if (typeof DB_PWD === 'undefined') {
    console.log(Date.now(), "[Error] the environment variable DB_PWD is not set.");
    process.exit(1);
}
if (typeof WALLET=== 'undefined') {
    console.log(Date.now(), "[Error] the environment variable WALLET is not set.");
    process.exit(1);
}
if (typeof FEES=== 'undefined') {
    console.log(Date.now(), "[Error] the environment variable FEES is not set.");
    process.exit(1);
}

console.log("Dex Server - v.1.00");
console.log("Listening on port tcp/3001 ....");
mainloop();
// main body
async function mainloop(){
    //connect database
    let connection = await mysql.createConnection({
        host     : DB_HOST,
        user     : DB_USER,
        password : DB_PWD,
        database : DB_NAME,
        multipleStatements : true
    });
    // main page is dex.html with a permannet redirect
    app.get('/', async function (req, res) {
       res.redirect(301, 'dex.html');     
    });
    // get price from 0x protocol
    app.get('/price',async function (req, res) {
       // forward parameters received
       const params = {
         sellToken: req.query.sellToken,
         buyToken: req.query.buyToken,
         sellAmount: req.query.sellAmount,
         buyTokenPercentageFee: FEES,
         feeRecipient: WALLET,
         affiliateAddress: WALLET
       }
       let chainId=req.query.chainId;
       const endpoint= await get_api_endpoint(chainId);
       console.log("endpoint",endpoint);
       console.log("params",params);
       // Fetch the swap price.
       const response = await fetch(`${endpoint}price?${qs.stringify(params)}`,{method: 'GET',headers:{'0x-api-key':APIKEY},},);
       let swapPriceJSON = await  response.json();
       console.log("Price: ", swapPriceJSON);
       res.send(JSON.stringify(swapPriceJSON));
    });
    // get quote from 0x protocol (booking the funds of the liquidity provider)
    app.get('/quote',async function (req, res) {
       // forward parameters received
       
       // check then slippage
       let slippage=0.01;
       if(typeof req.query.slippagePercentage !== 'undefined'){
         if(req.query.slippagePercentage>1)
           slippage=1;
         if(req.query.slippagePercentage<0)
           slippage=0;
         if(req.query.slippagePercentage>=0 && req.query.slippagePercentage<=1){
           slippage=req.query.slippagePercentage;
         }
       }
       const params = {
         sellToken: req.query.sellToken,
         buyToken: req.query.buyToken,
         sellAmount: req.query.sellAmount,
         takerAddress: req.query.takerAddress,
         buyTokenPercentageFee: FEES,
         feeRecipient: WALLET,
         affiliateAddress: WALLET,
         slippagePercentage:slippage
       }
       console.log("params ",params);
       let chainId=req.query.chainId;
       const endpoint= await get_api_endpoint(chainId);
       // Fetch the swap price.
       const response = await fetch(`${endpoint}quote?${qs.stringify(params)}`,{method: 'GET',headers:{'0x-api-key':APIKEY},},);
       let swapQuoteJSON = await  response.json();
       console.log("Quote: ", swapQuoteJSON);
       res.send(JSON.stringify(swapQuoteJSON));
    });
    // fetch tokens list
    app.get('/tokens',async function (req, res) {
        let chainIds=req.query.chainId;
        let chainId=1;
        if(typeof chainIds !== 'undefined'){
            chainId=parseInt(chainIds);        
        }
        console.log("Tokens for chainid",chainId);
        const [rows, fields] = await connection.execute('select symbol,name,address,chainid,decimals,originallogouri as logouri from tokens where chainid=? order by ranking desc,symbol',[chainId]);
        //console.log(rows);
        res.send(JSON.stringify(rows));
    });
    // fetch best gas price
    app.get('/bestgasprice',async function (req, res) {
        const [rows, fields] = await connection.execute('select *,gwei*usdrate/1000000000 as gasprice from gasstation order by gasprice desc');
        //console.log(rows);
        res.send(JSON.stringify(rows[0]));
    });
    // get token price in USD (for gas fees only, so only a few tokens are supported)
    app.get('/priceusd',async function (req, res) {
       let token=req.query.token;
       if(typeof token === 'undefined')	{
          res.send('{"price":0.0}');
          return;
       }
        
       let tokens=['ETH','MATIC','BNB','CELO','FTM','AVAX'];
       //check for supported token
       let x=-1;
       for(i=0;i<tokens.length;i++){
          if(tokens[i]===token){
             x=i;
             break;
          }
       }
       //for unsupported token returns 0
       if(x==-1){
          res.send('{"price":0.0}');
          return;
       }
       // search for updated prices in the database (last 5 minutes price)
        const [rows, fields] = await connection.execute("select * from prices where symbol=? and dtupdate>now() - interval 5 minute",[token]);       
        if(rows.length==0){
            //get update price from coingecko
            let id;
            let name;
            if(token=="ETH")
              id="ethereum";
            if(token=="MATIC")
              id="matic-network";
            if(token=="BNB")
              id="binancecoin";
            if(token=="CELO")
              id="celo";  
            if(token=="FTM")
              id="fantom";  
            if(token=="AVAX")
              id="avalanche-2";
            const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=USD`,{method: 'GET'},);
            const price = await  response.json();       
            console.log("Sending price for: ",id," = ",price[id]['usd']);
            // store in the database as cache
            await connection.execute("delete from prices where  symbol=?",[token]);
            await connection.execute("insert into prices set symbol=?,name=?,decimals=18,priceusd=?,dtupdate=now()",[token,token,price[id]['usd']]);
            // return price
            res.send('{"price":'+price[id]['usd'].toString()+'}');
            return;
        }
        else {
           res.send('{"price":'+rows[0].priceusd.toString()+'}');
           return;
        }
    });
    //function to get the token metadata, it's cached for 1 day 
    app.get('/tokenmetadata',async function (req, res) {
       let token=req.query.token;
       if(typeof token === 'undefined') {
          res.send('{"error":"token parameter is missing"}');
          return;
       }
       // search the token for chainid 1 - Etheurum
        const [rows, fields] = await connection.execute('select *  from tokens where chainid=1 and symbol=?',[token]);
        if(rows.length===0){
           res.send('{"error":"token not found"}');
           return;
        }
        let usecache=false;
        // check for cache data
        if(rows[0].metadata !== null){
             let j=JSON.parse(rows[0].metadata);
             let lastupdate= new Date(j.status.timestamp);
             let currentdate= new Date();
             let days= await getDaysDifference(lastupdate,currentdate);
             if(days<1)
              usecache=true;
        }
        if(usecache==false){
           //fetch metadata from coinmarketcap
           const response = await fetch(`https://pro-api.coinmarketcap.com/v2/cryptocurrency/info?address=${rows[0].address}`,{method: 'GET',headers:{"X-CMC_PRO_API_KEY":COINMARKETCAPAPIKEY}});
           const metadata = await  response.json();       
           // send back the metadata
           res.send(metadata);
           // store the metadata in the database
           connection.execute("update tokens set metadata=? where symbol=? and chainid=1",[JSON.stringify(metadata),token]);
           console.log("fetched data from coinmarketcap");
           return;
        }
        else {
           // send cache data
           res.send(rows[0].metadata);
        }
    
    });
    
    // get files from html folder
    app.use(express.static('html'));

    //listen on port 3000
    // a reverse proxy is necessary to use https
    let server = app.listen(3000, function () { });
}
async function get_api_endpoint(chainId){
    if(typeof chainId=='undefined' || chainId==0x1){
       return("https://api.0x.org/swap/v1/");
    }
    // Goerli Ethereum
    if(chainId==0x5){
       return("https://goerli.api.0x.org/swap/v1/");
    }
    // polygon
    if(chainId==0x89){
       return("https://polygon.api.0x.org/swap/v1/");
    }
    // Mumbai polygon
    if(chainId==0x13881){
       return("https://mumbai.api.0x.org/swap/v1/");
    }
    // Binance Smart Chain
    if(chainId==0x38){
       return("https://bsc.api.0x.org/swap/v1/");
    }
    // Optimism
    if(chainId==0xa){
       return("https://optimism.api.0x.org/swap/v1/");
    }
    // Fantom
    if(chainId==0xfa){
       return("https://fantom.api.0x.org/swap/v1/");
    }
    // Celo
    if(chainId==0xa4ec){
       return("https://celo.api.0x.org/swap/v1/");
    }
    // Avalanche
    if(chainId==0xa86a){
       return("https://avalanche.api.0x.org/swap/v1/");
    }
    // Arbitrum
    if(chainId==0xa4b1){
       return("https://arbitrum.api.0x.org/swap/v1/");
    }
    
}
// function to compute the difference between 2 dates in days
function getDaysDifference(date1, date2) {
  // Get the time values in milliseconds
  const time1 = date1.getTime();
  const time2 = date2.getTime();

  // Calculate the difference in milliseconds
  const diffInMs = Math.abs(time2 - time1);

  // Convert milliseconds to days
  const msInDay = 1000 * 60 * 60 * 24;
  const diffInDays = Math.floor(diffInMs / msInDay);

  return diffInDays;
}

