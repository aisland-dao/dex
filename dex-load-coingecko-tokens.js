// app to update the tokens table from Coingecko token list downloaded
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
console.log("Dex - Loading tokens from Coingecko v. 1.00");
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
      j = fs.readFileSync('/usr/src/dex/json/coingeckocoinslist.json', 'utf8');
    } catch (err) {
      console.error(err);
      return;
    }
    let js=JSON.parse(j);
    let sqlquery;
    let fieldsv;
    // iterate all the tokens
    let i=0;
    console.log(js);
    for(i in js){
        //console.log(js.tokens[i].symbol);
        const k=Object.keys(js[i].platforms);
        const v=Object.values(js[i].platforms)
        for(x in k){
            await update_token(js[i],k[x],v[x],connection);
        }

    }    
    console.log("Processed: "+i+' tokens.');
    await connection.end;
    process.exit(0);
}
// function to update the record of the token
async function update_token(js,platform,address,connection){
        const [rows, fields] = await connection.execute('select * from tokens where symbol=? and platform=?',[js.symbol,platform]);
        if(rows.length==0){
                  sqlquery="insert into tokens set symbol=?,name=?,decimals=?,platform=?,address=?,dtupdate=now()";
                  console.log(sqlquery);
                  fieldsv= [js.symbol,js.name,js.decimals,platform,address];
                  //console.log(fieldsv);
                  await connection.execute(sqlquery,fieldsv);
        }
        else{
                  sqlquery="update tokens set name=?,decimals=?,platform=?,address=?,dtupdate=now() where symbol=?";
                  console.log(sqlquery);
                  fieldsv=[js.name,js.decimals,platform,address,js.symbol];
                  await connection.execute(sqlquery,fieldsv);
        }
}