// requirement for the x0 protocol call
const  qs = require('qs');
//import qs from 'qs';
const BigNumber = require('bignumber.js');
//import BigNumber from 'bignumber.js';
const web3 = require('web3');
//import web3 from 'web3';
// requested from connectkit
import React from 'react';
import ReactDOM from 'react-dom/client';
import { WagmiConfig, createConfig } from 'wagmi';
import { mainnet, polygon, celo,fantom,avalanche,bsc,optimism, arbitrum,goerli,polygonMumbai } from 'wagmi/chains';
import { ConnectKitProvider, getDefaultConfig } from 'connectkit';
import { ConnectKitButton } from 'connectkit';
import { useAccount } from "wagmi";
// global vars
let  currentTrade = {};
let  currentSelectSide;
let tokens;
let connected=false;
let CHAINID=0;
let chainExplorer="";
let allowanceTarget=0x0;
async  function  connect() {
// Check if MetaMask is installed, if it is, try connecting to an account
    if (typeof  window.ethereum !== "undefined") {
        try {
  
            console.log("connecting");
            // Requests that the user provides an Ethereum address to be identified by. The request causes a MetaMask popup to appear. Read more: https://docs.metamask.io/guide/rpc-api.html#eth-requestaccounts
            await  ethereum.request({ method:  "eth_requestAccounts" });
        } catch (error) {
            console.log(error);
            return;
        }
        connected=true;
        // If connected, enable "Swap" button
        document.getElementById("swap_button").innerHTML = "Swap";
    } 
    // Ask user to install MetaMask if it's not detected 
    else {
        document.getElementById("swap_button").innerHTML = "Please install MetaMask";
        document.getElementById("message").innerHTML = 'Metamask is the most used Crypto Wallet on computer and mobile, please check the official website <a href="https://metamask.io">https://metamask.io</a>';
    }
}

// load the tokens
async function listAvailableTokens(){
  let url = window.location.protocol + "//" + window.location.host+"/tokens?chainId="+CHAINID;
  console.log(url);
  let response = await fetch(url);
  tokens = await response.json();
  await filterTokens("");
  
}
// function to show the tokens filtered by string
async function filterTokens(){
  //console.log("FilterTokens", document.getElementById("search_token").value);
  // Create a token list for the modal
  let parent = document.getElementById("token_list");
  // clean the previous children
  while (parent.hasChildNodes())
    parent.removeChild(parent.firstChild);
  // Loop through all the tokens inside the token list JSON object
  let s=document.getElementById("search_token").value;
  for (const i in tokens){
    // filter
    if(s.length>0){
      const ss=tokens[i].symbol.toUpperCase();
      const sn=tokens[i].name.toUpperCase();
      const search=s.toUpperCase();
      if(ss.includes(search)==false && sn.includes(search)==false)
        continue;
    }    
    // Create a row for each token in the list
    let div = document.createElement("div");
    div.className = "token_row";
    // For each row, display the token image and symbol
    let html = `
    <img class="token_list_img" src="${tokens[i].logouri}" width="25" height="25">
      <span class="token_list_text">${tokens[i].symbol} ${tokens[i].name}</span>
      `;
    div.innerHTML = html;
    // selectToken() will be called when a token is clicked
    div.onclick = () => {
      selectToken(tokens[i]);
    };
    parent.appendChild(div);
  }
}
// main body called at the loading
// render the blockchain name
await show_blockchain_name();
// load the tokens immediately
listAvailableTokens();
// Call the connect function when the login_button is clicked
//document.getElementById("login_button").onclick = connect;
// call openModal when you click on token
document.getElementById("from_token_select").onclick = () => {
  openModal("from");
};
document.getElementById("to_token_select").onclick = () => {
  openModal("to");
};
// search tokens event
const search_token = document.getElementById("search_token");
search_token.addEventListener("input", filterTokens);

// render connectkit button
render_connectkit();
// listen for change of the blockchain and reload in case
if (typeof  window.ethereum !== "undefined")
  window.ethereum.on('chainChanged', (chainId) => window.location.reload());
// popover call
$(function () {
  $('[data-toggle="popover"]').popover()
});
// function to show the blockchain name
async function show_blockchain_name(){
  // fetch the chainid
  let chainId;
  try {
     chainId = await window.ethereum.request({ method: 'eth_chainId' });
  } catch(e){
    console.log(e);
    return;
  }
  CHAINID=chainId;
  // set the title
  let m="<H4>Swap";
  let b="from unsupported network ("+chainId.toString()+")";
  if(chainId==0x1){
    b="from Ethereum";
    chainExplorer="https://etherscan.io/tx/"
  }
  if(chainId==0x5){
    b="from Goerli Ethereum";
    chainExplorer="https://goerli.therscan.io/tx/"
  }
  if(chainId==0x89){
    b="from Polygon";
    chainExplorer="https://polygonscan.com/tx/"
  }
  if(chainId==0x13881){
    b="from Mumbai Polygon";    
    chainExplorer="https://mumbai.polygonscan.com/tx/"
 }
  if(chainId==0x38){
    b="from BSC";  
    chainExplorer="https://bscscan.com/tx/";
 }
  if(chainId==0xa){
    b="from Optimistic";      
    chainExplorer="https://optimistic.etherscan.io/tx/";
  }
  if(chainId==0xfa){
    b="from Fantom";    
    chainExplorer="https://ftmscan.com/tx/";
  }
  if(chainId==0xa4ec){
    b="from Celo";    
    chainExplorer="https://celoscan.io/tx/";
  }    
  if(chainId==0xa86a){
    b="from Avalanche";        
    chainExplorer="https://snowtrace.io/tx/";
  }
  if(chainId==0xa4b1){
    b="from Arbitrum";        
    chainExplorer="https://arbiscan.io/tx/";
  }
  m+=" "+b+"</H4>";
  document.getElementById("blockchain").innerHTML = m;

}

// function to open the modal view of token list
function  openModal(side){
    // Store whether the user has selected a token on the from or to side
    currentSelectSide = side;
    document.getElementById("token_modal").style.display = "block";
}
// enable button to close the modal
document.getElementById("modal_close").onclick = closeModal;
// get event to compute price
document.getElementById("from_amount").onblur = getPrice;
// swap button
document.getElementById("swap_button").onclick = trySwap;

function  closeModal(){
    document.getElementById("token_modal").style.display = "none";
}
// function to select a token, called when clicked
function  selectToken(token) {
    // When a token is selected, automatically close the modal
    closeModal();
    // Track which side of the trade we are on - from/to
    currentTrade[currentSelectSide] = token;
    // Log the selected token
    console.log("currentTrade:" , currentTrade);
    renderInterface();
}
// Function to display the image and token symbols 
function renderInterface(){
  let carter='<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-down" viewBox="0 0 16 16"><path d="M3.204 5h9.592L8 10.481 3.204 5zm-.753.659 4.796 5.48a1 1 0 0 0 1.506 0l4.796-5.48c.566-.647.106-1.659-.753-1.659H3.204a1 1 0 0 0-.753 1.659z"/></svg>';
  if (currentTrade.from) {
    //console.log(currentTrade.from)
    // Set the from token image
    document.getElementById("from_token_img").src = currentTrade.from.logouri;
    document.getElementById("from_token_img").width=40;
     // Set the from token symbol text
    document.getElementById("from_token_text").innerHTML = currentTrade.from.symbol+" "+carter;
   // //show the tokens metadata if available
   // render_tokensmetadata([document.getElementById("from_token_text").innerText,document.getElementById("to_token_text").innerText]);
  }
  if (currentTrade.to) {
      // Set the to token image
    document.getElementById("to_token_img").src = currentTrade.to.logouri;
    document.getElementById("to_token_img").width=40;
      // Set the to token symbol text
    document.getElementById("to_token_text").innerHTML = currentTrade.to.symbol+" "+carter;
    //show the tokens metadata if available
   /// render_tokensmetadata([document.getElementById("to_token_text").innerText,document.getElementById("from_token_text").innerText]);
  }
  if(currentSelectSide=="from"){
    //show the tokens metadata if available
    render_tokensmetadata([document.getElementById("from_token_text").innerText,document.getElementById("to_token_text").innerText]);
  }else {
    render_tokensmetadata([document.getElementById("to_token_text").innerText,document.getElementById("from_token_text").innerText]);  
  }
  //udpate the price
  getPrice();

}

// function to get best price for swapping
async  function  getPrice(){
  console.log("Getting Price");
  // Only fetch price if from token, to token, and from token amount have been filled in 
  if (!currentTrade.from || !currentTrade.to || !document.getElementById("from_amount").value) return;
    // The amount is calculated from the smallest base unit of the token. We get this by multiplying the (from amount) x (10 to the power of the number of decimal places)
  //let  amount = Number(document.getElementById("from_amount").value * 10 ** currentTrade.from.decimals);
  let  d=new BigNumber(10).pow(currentTrade.from.decimals);
  let amount=  new BigNumber(Number(document.getElementById("from_amount").value)).multipliedBy(d);
  //console.log("from_amount ",document.getElementById("from_amount").value);
  //console.log("currentTrade.from.decimals ",currentTrade.from.decimals);
  //console.log("amount: ",amount.toFixed());
  const params = {
    sellToken: currentTrade.from.address,
    buyToken: currentTrade.to.address,
    sellAmount: amount.toFixed(),
    chainId: CHAINID
  }
  document.getElementById('message').innerHTML='';
  // Fetch the swap price.
  let url = window.location.protocol + "//" + window.location.host+"/price";
  const response = await fetch(url+`?${qs.stringify(params)}`,{method: 'GET',headers:{'0x-api-key':'ef2f16cd-2ff8-46d7-8132-acbaa16d0a34'},},);
  let swapPriceJSON = await  response.json();
  console.log("Price: ", swapPriceJSON);
  // in case of error
  if(typeof swapPriceJSON.code !== 'undefined'){
    let message='<div class="alert alert-danger" role="alert">Error: '+swapPriceJSON.code.toString()+" - "+swapPriceJSON.reason;
    message=message+" - "+swapPriceJSON.validationErrors[0].description;
    message=message+'</div><hr>';
    document.getElementById('message').innerHTML=message;
    document.getElementById("to_amount").value=0;
    return;
  }
  // Use the returned values to populate the buy Amount and the estimated gas in the UI
  let price=swapPriceJSON.buyAmount / (10 ** currentTrade.to.decimals);
  price=price.toFixed(6);
  document.getElementById("to_amount").value = price;
  let priceusd=await getpriceusd();
  let gasusd=swapPriceJSON.estimatedGas*swapPriceJSON.gasPrice/1000000000000000000*priceusd;
  //get best gas fees on Po
  let gp= await getBestGasprice()
  let bestgasprice=swapPriceJSON.estimatedGas*gp;
  //console.log("bestgasprice",bestgasprice);
  let note='';
  // add note for Polygon if not already on it
  if(CHAINID!=0x89 && bestgasprice<gasusd){
   note='<p class="text-warning bg-dark">';
   const saveperc=100*gasusd/bestgasprice;
   note=note+' <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-piggy-bank" viewBox="0 0 16 16"><path d="M5 6.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0zm1.138-1.496A6.613 6.613 0 0 1 7.964 4.5c.666 0 1.303.097 1.893.273a.5.5 0 0 0 .286-.958A7.602 7.602 0 0 0 7.964 3.5c-.734 0-1.441.103-2.102.292a.5.5 0 1 0 .276.962z"/><path fill-rule="evenodd" d="M7.964 1.527c-2.977 0-5.571 1.704-6.32 4.125h-.55A1 1 0 0 0 .11 6.824l.254 1.46a1.5 1.5 0 0 0 1.478 1.243h.263c.3.513.688.978 1.145 1.382l-.729 2.477a.5.5 0 0 0 .48.641h2a.5.5 0 0 0 .471-.332l.482-1.351c.635.173 1.31.267 2.011.267.707 0 1.388-.095 2.028-.272l.543 1.372a.5.5 0 0 0 .465.316h2a.5.5 0 0 0 .478-.645l-.761-2.506C13.81 9.895 14.5 8.559 14.5 7.069c0-.145-.007-.29-.02-.431.261-.11.508-.266.705-.444.315.306.815.306.815-.417 0 .223-.5.223-.461-.026a.95.95 0 0 0 .09-.255.7.7 0 0 0-.202-.645.58.58 0 0 0-.707-.098.735.735 0 0 0-.375.562c-.024.243.082.48.32.654a2.112 2.112 0 0 1-.259.153c-.534-2.664-3.284-4.595-6.442-4.595zM2.516 6.26c.455-2.066 2.667-3.733 5.448-3.733 3.146 0 5.536 2.114 5.536 4.542 0 1.254-.624 2.41-1.67 3.248a.5.5 0 0 0-.165.535l.66 2.175h-.985l-.59-1.487a.5.5 0 0 0-.629-.288c-.661.23-1.39.359-2.157.359a6.558 6.558 0 0 1-2.157-.359.5.5 0 0 0-.635.304l-.525 1.471h-.979l.633-2.15a.5.5 0 0 0-.17-.534 4.649 4.649 0 0 1-1.284-1.541.5.5 0 0 0-.446-.275h-.56a.5.5 0 0 1-.492-.414l-.254-1.46h.933a.5.5 0 0 0 .488-.393zm12.621-.857a.565.565 0 0 1-.098.21.704.704 0 0 1-.044-.025c-.146-.09-.157-.175-.152-.223a.236.236 0 0 1 .117-.173c.049-.027.08-.021.113.012a.202.202 0 0 1 .064.199z"/></svg>';
   note=note+' -'+saveperc.toFixed(0).toString()+' % gas';
   note=note+' on <a href=https://polygon.io/><img src="images/polygon.png" width="20"></a> Polygon';
   note=note+" ("+bestgasprice.toFixed(2).toString()+' USD)';
   note=note+'</p>';
  }
  document.getElementById("gas_estimate").innerHTML = swapPriceJSON.estimatedGas.toString()+" ("+gasusd.toFixed(2).toString()+" USD) "+note;
  // set global variable for target allowance
  allowanceTarget=swapPriceJSON.allowanceTarget;
  return;

}
// Function to get a quote from the protocol
async function getQuote(account){
  console.log("Getting Quote");

  if (!currentTrade.from || !currentTrade.to || !document.getElementById("from_amount").value) return;
  //let amount = Number(document.getElementById("from_amount").value * 10 ** currentTrade.from.decimals);
  let d=new BigNumber(10).pow(currentTrade.from.decimals);
  let amount=  new BigNumber(Number(document.getElementById("from_amount").value)).multipliedBy(d);
  console.log("Amount: ",amount.toFixed());
  let slippage=0.0;
  slippage=document.getElementById("slippagePercentage").value;
  if(slippage<0)
   slippage=0.0;
  if(slippage>100)
   slippage=100;
  if(slippage>0)
   slippage=slippage/100;
  const params = {
    sellToken: currentTrade.from.address,
    buyToken: currentTrade.to.address,
    sellAmount: amount.toFixed(),
    // Set takerAddress to account 
    takerAddress: account,
    slippagePercentage: slippage,
    chainId: CHAINID
  }
  //console.log("params: ",params);
  // Fetch the swap quote.
  let url = window.location.protocol + "//" + window.location.host+"/quote";
  const response = await fetch(url+`?${qs.stringify(params)}`);
  let swapQuoteJSON = await response.json();
  console.log("Quote New: ", swapQuoteJSON);
  // in case of error
  if(typeof swapQuoteJSON.code !== 'undefined'){
    let message='<div class="alert alert-danger" role="alert">Error: '+swapQuoteJSON.code.toString()+" - "+swapQuoteJSON.reason;
    message=message+" - "+swapQuoteJSON.values.message;
    message=message+'</div><hr>';
    document.getElementById('message').innerHTML=message;
    document.getElementById("to_amount").value=0;
    return;
  }
  console.log("swapQuoteJSON.code",swapQuoteJSON.code);  
  console.log("new");
  document.getElementById("to_amount").value = swapQuoteJSON.buyAmount / (10 ** currentTrade.to.decimals);
  let priceusd=await getpriceusd();
  let gasusd=swapQuoteJSON.estimatedGas*swapQuoteJSON.gasPrice/1000000000*priceusd;
  document.getElementById("gas_estimate").innerHTML = swapQuoteJSON.estimatedGas.toString()+"( "+gasusd.toFixed(2).toString()+" USD)";
  return swapQuoteJSON;
}
//function to to perform the Swap (it may fail)
async  function  trySwap(){
  if(connected==false){
    connect();
    return;
  }
  if (!currentTrade.from || !currentTrade.to || !document.getElementById("from_amount").value) 
   return;
  
  document.getElementById("message").innerHTML ='<div class="d-flex justify-content-center"><div class="spinner-grow text-primary" style="width: 3rem; height: 3rem;" role="status"> <span class="sr-only">Loading...</span></div></div>';
  // The address, if any, of the most recently used account that the caller is permitted to access
  let accounts = await ethereum.request({ method: "eth_accounts" });
  let takerAddress = accounts[0];
  // amount to sell
  let d=new BigNumber(10).pow(currentTrade.from.decimals);
  let amount=  new BigNumber(Number(document.getElementById("from_amount").value)).multipliedBy(d);
  let sellAmount=amount.toFixed();
  // In order for us to interact with a ERC20 contract's method's, need to create a web3 object. This web3.eth.Contract object needs a erc20abi which we can get from any erc20 abi as well as the specific token address we are interested in interacting with, in this case, it's the fromTokenAddrss
  // Setup the erc20abi in json format so we can interact with the approve method below
  const erc20abi= [{ "inputs": [ { "internalType": "string", "name": "name", "type": "string" }, { "internalType": "string", "name": "symbol", "type": "string" }, { "internalType": "uint256", "name": "max_supply", "type": "uint256" } ], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "Transfer", "type": "event" }, { "inputs": [ { "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" } ], "name": "allowance", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "approve", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "account", "type": "address" } ], "name": "balanceOf", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "burn", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "account", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "burnFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "decimals", "outputs": [ { "internalType": "uint8", "name": "", "type": "uint8" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "subtractedValue", "type": "uint256" } ], "name": "decreaseAllowance", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "addedValue", "type": "uint256" } ], "name": "increaseAllowance", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "name", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "transfer", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "transferFrom", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }]
  // Set up approval amount for the token we want to trade from
  const fromTokenAddress = currentTrade.from.address;
  const  web3 = new  Web3(Web3.givenProvider);
  const ERC20TokenContract = new web3.eth.Contract(erc20abi, fromTokenAddress);
  console.log("setup ERC20TokenContract: ", ERC20TokenContract);
  try{
    // Grant the allowance target (the 0x Exchange Proxy) an  allowance to spend our tokens. Note that this is a txn that incurs fees. 
    const tx = await ERC20TokenContract.methods.approve(allowanceTarget,sellAmount,)
    .send({ from: takerAddress })
    .then(tx => {
     console.log("tx: ", tx)
     });
   }
   catch(e){
      let message='<div class="alert alert-danger" role="alert">Error: '+e.message;
      message=message+'</div><hr>';
      document.getElementById('message').innerHTML=message;
      return;
   }
  // Log the the most recently used address in our MetaMask wallet
  console.log("takerAddress: ", takerAddress);
  // Pass this as the account param into getQuote() we built out earlier. This will return a JSON object trade order. 
  const  swapQuoteJSON = await  getQuote(takerAddress);
  //console.log(swapQuoteJSON);
  //console.log("fromTokenAddress",fromTokenAddress);
  //console.log("currentTrade",currentTrade);

  // Perform the swap
  try{
    const  receipt = await  web3.eth.sendTransaction(swapQuoteJSON);
    console.log("receipt: ", receipt);
    //show the transaction hash
    document.getElementById("message").innerHTML = 'Swap submitted... <a href="'+chainExplorer+receipt.transactionHash+'" target="_blank">View in explorer</a>';
    return;
  }
  catch(e){
      let message='<div class="alert alert-danger" role="alert">Error: '+e.message;
      message=message+'</div><hr>';
      document.getElementById('message').innerHTML=message;
      return;
  }
}
// function to show the get the price in USD of the native token of the selectet blockchain,for gas fees in USD.
async function getpriceusd(){
  // fetch the chainid
  let chainId;
  try {
     chainId = await window.ethereum.request({ method: 'eth_chainId' });
  } catch(e){
    console.log(e);
    return(0);
  }
  let t;
  if(chainId==0x1)
    t="ETH";
  if(chainId==0x5)
    t="ETH";    
  if(chainId==0x89)
    t="MATIC";
  if(chainId==0x13881)
    t="MATIC";
  if(chainId==0x38)
    t="BNB";  
  if(chainId==0xa)
    t="ETH";      
  if(chainId==0xfa)
    t="FTM";    
  if(chainId==0xa4ec)
    t="CELO";        
  if(chainId==0xa86a)
    t="AVAX";        
  if(chainId==0xa4b1)
    t="ETH";        
  // fetch price from our API server
  let url = window.location.protocol + "//" + window.location.host+"/priceusd";
  let response = await fetch(url+'?token='+t);
  let j = await response.json();
  return(j['price']);
} 
// function to fetch the gas price for Polygon
async function getBestGasprice(){
  // fetch best gas price from our API server
  let url = window.location.protocol + "//" + window.location.host+"/bestgasprice";
  let response = await fetch(url);
  let j = await response.json();
  return(j['gasprice']);
} 
// function to render to tokens metadata
async function render_tokensmetadata(tokens){
 console.log(tokens);
 let c='<div class="jumbotron">';
 let i=0;
 for (i in tokens){
  // check for valid symbol
  if(tokens[i]=="To Token" || tokens[i]=="From Token")
    continue;
  // fetch metadata
  
  let url = window.location.protocol + "//" + window.location.host+"/tokenmetadata"+'?token='+tokens[i].replace("#","%23");
  console.log(url);
  let response = await fetch(url);
  let md = await response.json();
  // check for valid metadata
  if(typeof md.data ==='undefined')
   continue;
  // build a table with the metadata
  let k=Object.values(md.data)[0][0];
  console.log('k',k);
  c=c+'<table class="table table-striped-columns table-responsive-sm">' ;
  c=c+"<tr><td>Name</td><td>"+k.name+'&nbsp;&nbsp;<img src="'+k.logo+'" width="50"></td></tr>';  
  // add a space after the first 'and'
  let d=k.description.replace("and"," and");
  c=c+'<tr><td>Description</td><td>'+d+'</td></tr>';  
  c=c+"<tr><td>More info</td><td>";
  if(typeof k.urls.website[0] != 'undefined'){
   if(k.urls.website[0].length>0)
       c=c+'<a href="'+k.urls.website[0]+'"><img src="images/web.png"></a>';  
  }
  if(typeof k.urls.twitter != 'undefined'){
   if(typeof k.urls.twitter[0] != 'undefined'){
    if(k.urls.twitter[0].length>0)
        c=c+'&nbsp;<a href="'+k.urls.twitter[0]+'"><img src="images/twitter.png"></a>';  
   }
  }
  if(typeof k.urls.facebook!= 'undefined'){
   if(typeof k.urls.facebook[0] != 'undefined'){
    if(k.urls.facebook[0].length>0)
        c=c+'&nbsp;<a href="'+k.urls.facebook[0]+'"><img src="images/facebook.png"></a>';  
   }
  }  
  if(typeof k.urls.reddit != 'undefined'){
   if(typeof k.urls.reddit[0] != 'undefined'){
    if(k.urls.reddit[0].length>0)
        c=c+'&nbsp;<a href="'+k.urls.reddit[0]+'"><img src="images/reddit.png"></a>';  
   }
  }
  if(typeof k.urls.source_code != 'undefined'){
   if(typeof k.urls.source_code[0] != 'undefined'){
    if(k.urls.source_code[0].length>0)
        c=c+'&nbsp;<a href="'+k.urls.source_code[0]+'"><img src="images/github.png"></a>';  
    }
  }
  if(typeof k.urls.chat != 'undefined'){
   if(typeof k.urls.chat[0] != 'undefined'){
    if(k.urls.chat[0].length>0)
        c=c+'&nbsp;<a href="'+k.urls.chat[0]+'"><img src="images/chat.png"></a>';  
   }
  }
  if(typeof k.urls.explorer != 'undefined'){
   if(typeof k.urls.explorer[0] != 'undefined'){
    if(k.urls.explorer[0].length>0)
        c=c+'&nbsp;<a href="'+k.urls.explorer[0]+'"><img src="images/explorer.png"></a>';  
   }
  }
  //console.log(k);
  
  c=c+"</table>";
 }
 c=c+'</div>';
 document.getElementById("tokenmetadata").innerHTML=c;
}
// function to render the connectkit button
async function render_connectkit(){
  const config = createConfig(
   getDefaultConfig({
    appName: 'Aisland Dex',
    infuraId: '58ea4b33a1fc4534bb1d8e2983e51993',
    autoConnect: true,
    chains: [mainnet, polygon, celo,fantom,avalanche,bsc,optimism,arbitrum,goerli,polygonMumbai],
    walletConnectProjectId: '243a2d7fcdff36a840b899d68a4c9eed'
    //headlessMode: true
   })
  );
  const root = ReactDOM.createRoot(
     document.getElementById('mainbutton') // as HTMLElement
   );
   
   root.render(
     <React.StrictMode>
       <WagmiConfig config={config}>
        <ConnectKitProvider options={{showBalance:true}}>
         <App />
        </ConnectKitProvider>
      </WagmiConfig>
     </React.StrictMode>
   );
   
   const status = ReactDOM.createRoot(
     document.getElementById('status') 
   );

   status.render(
     <React.StrictMode>
     <WagmiConfig config={config}>
        <ConnectKitProvider>
        <ShowStatus />
        </ConnectKitProvider>
     </WagmiConfig>
     </React.StrictMode>
   );
   
}
// function to render the wallet connect button
function App() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '5vh',
      }}
    >
      <ConnectKitButton />
    </div>
  );
}
// function to show the updated status of the wallet/account
function ShowStatus(){
  const { address, isConnecting, isDisconnected } = useAccount();
  if (isConnecting){
   document.getElementById("status").hidden = false;   
   return <div>Connecting...</div>;
  }
  if (isDisconnected){
    document.getElementById("swap_button").disabled = true;   
    document.getElementById("swap_button").hidden = true;   
    document.getElementById("status").hidden = false;   
    return <div>Disconnected</div>;
  }
  // in case of "connected" status
  connect();
  document.getElementById("swap_button").disabled = false;
  document.getElementById("swap_button").hidden = false;   
  document.getElementById("status").hidden = true;   
  return <div>Connected Wallet: {address}</div>;
}