// Dex Server - It allows to fetch static files and API
let express = require('express');
let fs=require("fs");
const path = require('path')
const qs=require("qs");
let mysql = require('mysql2/promise');

let app = express();
const APIKEY = process.env.APIKEY
// set default to local host if not set
if (typeof APIKEY === 'undefined') {
    console.log(Date.now(), "[Error] the environment variable APIKEY is not set.");
    process.exit(1);
}
const DB_HOST = process.env.DB_HOST
const DB_NAME = process.env.DB_NAME
const DB_USER = process.env.DB_USER
const DB_PWD = process.env.DB_PWD
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
console.log("Dex Server - v.1.00");
console.log("Listening on port tcp/3000 ....");
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
       }
       console.log(req.query);
       console.log(params);
       // Fetch the swap price.
       const response = await fetch(`https://api.0x.org/swap/v1/price?${qs.stringify(params)}`,{method: 'GET',headers:{'0x-api-key':APIKEY},},);
       let swapPriceJSON = await  response.json();
       console.log("Price: ", swapPriceJSON);
       res.send(JSON.stringify(swapPriceJSON));
    });
    // get quote from 0x protocol (booking the funds of the liquidity provider)
    app.get('/quote',async function (req, res) {
       // forward parameters received
       const params = {
         sellToken: req.query.sellToken,
         buyToken: req.query.buyToken,
         sellAmount: req.query.sellAmount,
         //takerAddress: req.query.takerAddress,
       }
       console.log("params ",params);
       // Fetch the swap price.
       const response = await fetch(`https://api.0x.org/swap/v1/quote?${qs.stringify(params)}`,{method: 'GET',headers:{'0x-api-key':APIKEY},},);
       let swapQuoteJSON = await  response.json();
       console.log("Quote: ", swapQuoteJSON);
       res.send(JSON.stringify(swapQuoteJSON));
    });
    // fetch tokens list
    app.get('/tokens',async function (req, res) {
        const [rows, fields] = await connection.execute('select symbol,name,address,chainid,decimals,originallogouri as logouri from tokens order by ranking desc,symbol');
        //console.log(rows);
        res.send(JSON.stringify(rows));
    });

    // get files from html folder
    app.use(express.static('html'));

    //listen on port 3000
    // a reverse proxy is necessary to use https
    let server = app.listen(3000, function () { });
}