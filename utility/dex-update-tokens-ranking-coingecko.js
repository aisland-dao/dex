// app to update the tokens ranking based on a list from coingecko
let mysql = require('mysql2/promise');
let fs=require("fs");

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
console.log("Dex - Updating tokens ranking from Coingecko v. 1.00");
mainloop();
//main function body
async function mainloop(){
    let connection = await mysql.createConnection({
        host     : DB_HOST,
        user     : DB_USER,
        password : DB_PWD,
        database : DB_NAME,
        multipleStatements : true
    });
    let j;
    try {
      j = fs.readFileSync('/usr/src/dex/json/coingeckomarketcap.json', 'utf8');
    } catch (err) {
      console.error(err);
      return;
    }
    let js=JSON.parse(j);
    let sqlquery;
    let fieldsv;
    // iterate all the tokens
    let i=0;
    let x=0;
    let c=0;
    for(i in js){
        console.log("Processing: ",js[i].symbol);
        //console.log(js[i]);
        const [rows, fields] = await connection.execute('select * from tokens where symbol=?',[js[i].symbol]);
        if(rows.length>0){
          let ranking=parseInt(js[i].market_cap_rank)+10000-c;
          await connection.execute('update tokens set ranking=? where symbol=?',[ranking,js[i].symbol]);
          x=x+1;
        }
        c=c+3;
    }    
    console.log("Processed: "+x+' tokens.');
    await connection.end;
    process.exit(0);
}
