// app to update the tokens table from Uniswap list from https://gateway.ipfs.io/ipns/tokens.uniswap.org
let mysql = require('mysql2/promise');
let fs=require("fs");

const DB_HOST = process.env.DB_HOST
const DB_NAME = process.env.DB_NAME
const DB_USER = process.env.DB_USER
const DB_PWD = process.env.DB_PWD
const JSONFILE = process.env.JSONFILE
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
// JSON  is mandatory
if (typeof JSONFILE === 'undefined') {
    console.log(Date.now(), "[Error] the environment variable JSONFILE is not set.");
    process.exit(1);
}
console.log("Dex - Loading tokens from tokenlist.org standard format - v. 1.00");
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
      j = fs.readFileSync(JSONFILE, 'utf8');
    } catch (err) {
      console.error(err);
      return;
    }
    let js=JSON.parse(j);
    let sqlquery;
    let fieldsv;
    // iterate all the tokens
    let i=0;
    for(i in js.tokens){
        //console.log(js.tokens[i].symbol);
        const [rows, fields] = await connection.execute("select * from tokens where symbol=? and chainid=?",[js.tokens[i].symbol,js.tokens[i].chainId]);
        let uri=js.tokens[i].logoURI;
        if(typeof uri === 'undefined')
          uri='';
        if(rows.length==0){
                  sqlquery="insert into tokens set symbol=?,name=?,decimals=?,chainid=?,platform='ethereum',address=?,originallogouri=?,dtupdate=now()";
                  fieldsv= [js.tokens[i].symbol,js.tokens[i].name,js.tokens[i].decimals,js.tokens[i].chainId,js.tokens[i].address,uri];
                  //console.log(fieldsv);
                  await connection.execute(sqlquery,fieldsv);
        }
        else{
                  sqlquery="update tokens set name=?,decimals=?,platform='ethereum',address=?,originallogouri=?,dtupdate=now() where symbol=? and chainid=?";
                  fieldsv=[js.tokens[i].name,js.tokens[i].decimals,js.tokens[i].address,uri,js.tokens[i].symbol,js.tokens[i].chainId];
                  await connection.execute(sqlquery,fieldsv);
        }
    }    
    console.log("Processed: "+i+' tokens.');
    await connection.end;
    process.exit(0);
}