// app to update the tokens ranking based on a list from coingecko
let mysql = require('mysql2/promise');
let fs=require("fs");

const DB_HOST = process.env.DB_HOST
const DB_NAME = process.env.DB_NAME
const DB_USER = process.env.DB_USER
const DB_PWD = process.env.DB_PWD
const APIKEY = process.env.APIKEY
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
// APIKEY is mandatory
if (typeof APIKEY === 'undefined') {
    console.log(Date.now(), "[Error] the environment variable APIKEY is not set.");
    process.exit(1);
}

console.log("Dex - Updating gas fees for polygon");
mainloop();
async function mainloop(){
    let connection = await mysql.createConnection({
        host     : DB_HOST,
        user     : DB_USER,
        password : DB_PWD,
        database : DB_NAME,
        multipleStatements : true
    });
    //fetch gas data
    let url="https://api.polygonscan.com/api?module=gastracker&action=gasoracle&apikey="+APIKEY;
    const response = await fetch(url);
    let gasJSON = await  response.json();
    console.log(gasJSON);
    let symbol="MATIC";
    let chainid=137;
    let gasgwei=gasJSON.result.ProposeGasPrice;
    let usdRate=gasJSON.result.UsdPrice;
    const [rows, fields] = await connection.execute('select * from gasstation where symbol=? and chainid=?',[symbol,chainid]);
    if(rows.length>0){
          await connection.execute('update gasstation set gwei=?,usdrate=?,dtupdate=now() where symbol=? and chainid=?',[gasgwei,usdRate,symbol,chainid]);
    }else{
          await connection.execute('insert into gasstation set symbol=?,gwei=?,usdrate=?,chainid=?,dtupdate=now()',[symbol,gasgwei,usdRate,chainid]);
    }
     await connection.end;
    process.exit(0);
    return;
    
}