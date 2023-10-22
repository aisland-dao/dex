// #AISC and #AISG have a stable price, this app keep update the price in the same prices table.
let mysql = require('mysql2/promise');

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
console.log("Dex - Updating price for #AISC and #AISG");
mainloop();
//main body
async function mainloop(){
    let connection = await mysql.createConnection({
        host     : DB_HOST,
        user     : DB_USER,
        password : DB_PWD,
        database : DB_NAME,
        multipleStatements : true
    });
    let symbols=['#AISC','#AISG'];
    let names=['Aisland Coin','Aisland Governance'];
    let prices=[1,10];
    let i=0;
    for(symbol of symbols){
        console.log("Processing: ",symbol);
        const [rows, fields] = await connection.execute('select * from prices where symbol=?',[symbol]);
        if(rows.length==0){
            await connection.execute("insert into prices set symbol=?,name=?,decimals=18,priceusd=?,dtupdate=now()",[symbol,names[i],prices[i]]);
        }
        else {
            await connection.execute("update prices set dtupdate=now() where symbol=?",[symbol]);
        }
        i=i+1;
    }
    await connection.end();
    return;
}
    