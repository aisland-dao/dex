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
        // If connected, change button to "Connected"
        document.getElementById("login_button").innerHTML = "Connected";
        // If connected, enable "Swap" button
        //document.getElementById("swap_button").disabled = false;
        document.getElementById("swap_button").innerHTML = "Swap";
    } 
    // Ask user to install MetaMask if it's not detected 
    else {
        document.getElementById("login_button").innerHTML = "Please install MetaMask";
        document.getElementById("swap_button").innerHTML = "Please install MetaMask";
        document.getElementById("message").innerHTML = 'Metamask is the most used Crypto Wallet on computer and mobile, please check the official website <a href="https://metamask.io">https://metamask.io</a>';
    }
}

// load the tokens
async function listAvailableTokens(){
  let url = window.location.protocol + "//" + window.location.host+"/tokens";
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
// load the tokens immediately
listAvailableTokens();
// Call the connect function when the login_button is clicked
document.getElementById("login_button").onclick = connect;
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
// render the blockchain name
show_blockchain_name();
// render connectkit button
render_connectkit();
// listen for change of the blockchain and reaload in casen
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
  // set the title
  let m="<H4>Swap";
  let b=" from unsupported network ("+chainId.toString()+")";
  if(chainId==0x1)
    b="from Ethereum";
  if(chainId==0x5)
    b="from Goerli Ethereum";
  if(chainId==0x89)
    b="from Polygon";
  if(chainId==0x13881)
    b="from Mumbai Polygon";    
  if(chainId==0x38)
    b="from BSC";  
  if(chainId==0xa)
    b="from Optimism";      
  if(chainId==0xfa)
    b="from Fantom";    
  if(chainId==0xa4ec)
    b="from Celo";        
  if(chainId==0xa86a)
    b="from Avalanche";        
  if(chainId==0xa4b1)
    b="from Arbitrum";        
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
  if (currentTrade.from) {
    //console.log(currentTrade.from)
    // Set the from token image
    document.getElementById("from_token_img").src = currentTrade.from.logouri;
     // Set the from token symbol text
    document.getElementById("from_token_text").innerHTML = currentTrade.from.symbol;
   // //show the tokens metadata if available
   // render_tokensmetadata([document.getElementById("from_token_text").innerText,document.getElementById("to_token_text").innerText]);
  }
  if (currentTrade.to) {
      // Set the to token image
    document.getElementById("to_token_img").src = currentTrade.to.logouri;
      // Set the to token symbol text
    document.getElementById("to_token_text").innerHTML = currentTrade.to.symbol;
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

// funnction to get best price for swapping
async  function  getPrice(){
  console.log("Getting Price");
  // Only fetch price if from token, to token, and from token amount have been filled in 
  if (!currentTrade.from || !currentTrade.to || !document.getElementById("from_amount").value) return;
    // The amount is calculated from the smallest base unit of the token. We get this by multiplying the (from amount) x (10 to the power of the number of decimal places)
  //let  amount = Number(document.getElementById("from_amount").value * 10 ** currentTrade.from.decimals);
  let d=new BigNumber(10).pow(currentTrade.from.decimals);
  let amount=  new BigNumber(Number(document.getElementById("from_amount").value)).multipliedBy(d);
  //console.log("from_amount ",document.getElementById("from_amount").value);
  //console.log("currentTrade.from.decimals ",currentTrade.from.decimals);
  //console.log("amount: ",amount.toFixed());
  const params = {
    sellToken: currentTrade.from.address,
    buyToken: currentTrade.to.address,
    sellAmount: amount.toFixed(),
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
  document.getElementById("gas_estimate").innerHTML = swapPriceJSON.estimatedGas.toString()+"( "+gasusd.toFixed(2).toString()+" USD)";

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
    slippagePercentage: slippage
  }
  //console.log("params: ",params);
  // Fetch the swap quote.
  let url = window.location.protocol + "//" + window.location.host+"/quote";
  const response = await fetch(url+`?${qs.stringify(params)}`);
  let swapQuoteJSON = await response.json();
  console.log("Quote: ", swapQuoteJSON);
  
  document.getElementById("to_amount").value = swapQuoteJSON.buyAmount / (10 ** currentTrade.to.decimals);
  let priceusd=await getpriceusd();
  let gasusd=swapQuoteJSON.estimatedGas*swapQuoteJSON.gasPrice/1000000000000000000*priceusd;
  document.getElementById("gas_estimate").innerHTML = swapQuoteJSON.estimatedGas.toString()+"( "+gasusd.toFixed(2).toString()+" USD)";
  return swapQuoteJSON;
}
//function to to perform the Swap (it may fail)
async  function  trySwap(){
  if(connected==false){
    connect();
    return;
  }
  // The address, if any, of the most recently used account that the caller is permitted to access
  let accounts = await ethereum.request({ method: "eth_accounts" });
  let takerAddress = accounts[0];
  // Log the the most recently used address in our MetaMask wallet
  console.log("takerAddress: ", takerAddress);
  // Pass this as the account param into getQuote() we built out earlier. This will return a JSON object trade order. 
  const  swapQuoteJSON = await  getQuote(takerAddress);
  console.log(swapQuoteJSON);
  // Setup the erc20abi in json format so we can interact with the approve method below
  const erc20abi= [{ "inputs": [ { "internalType": "string", "name": "name", "type": "string" }, { "internalType": "string", "name": "symbol", "type": "string" }, { "internalType": "uint256", "name": "max_supply", "type": "uint256" } ], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "Transfer", "type": "event" }, { "inputs": [ { "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" } ], "name": "allowance", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "approve", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "account", "type": "address" } ], "name": "balanceOf", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "burn", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "account", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "burnFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "decimals", "outputs": [ { "internalType": "uint8", "name": "", "type": "uint8" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "subtractedValue", "type": "uint256" } ], "name": "decreaseAllowance", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "addedValue", "type": "uint256" } ], "name": "increaseAllowance", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "name", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "transfer", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "transferFrom", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }]
  // Set up approval amount for the token we want to trade from
  const fromTokenAddress = currentTrade.from.address;
  // In order for us to interact with a ERC20 contract's method's, need to create a web3 object. This web3.eth.Contract object needs a erc20abi which we can get from any erc20 abi as well as the specific token address we are interested in interacting with, in this case, it's the fromTokenAddrss
  // Read More: https://web3js.readthedocs.io/en/v1.2.11/web3-eth-contract.html#web3-eth-contract
  const  web3 = new  Web3(Web3.givenProvider);
  const ERC20TokenContract = new web3.eth.Contract(erc20abi, fromTokenAddress);
  console.log("setup ERC20TokenContract: ", ERC20TokenContract);
  // The max approval is set here. Using Bignumber to handle large numbers and account for overflow (https://github.com/MikeMcl/bignumber.js/)
  //const maxApproval = new BigNumber(2).pow(256).minus(1);
  const maxApproval=new BigNumber(swapQuoteJSON.sellAmount);
  console.log("approval amount: ", maxApproval);
  // Grant the allowance target (the 0x Exchange Proxy) an  allowance to spend our tokens. Note that this is a txn that incurs fees. 
  const tx = await ERC20TokenContract.methods.approve(swapQuoteJSON.allowanceTarget,swapQuoteJSON.sellAmount,)
  .send({ from: takerAddress })
  .then(tx => {
    console.log("tx: ", tx)
  });
  // Perform the swap
  const  receipt = await  web3.eth.sendTransaction(swapQuoteJSON);
  console.log("receipt: ", receipt);
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
  let url = window.location.protocol + "//" + window.location.host+"/tokenmetadata";
  let response = await fetch(url+'?token='+tokens[i]);
  let md = await response.json();
  // check for valid metadata
  if(typeof md.status ==='undefined')
   continue;
  // build a table with the metadata
  let k=Object.values(md.data)[0];
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
  if(typeof k.urls.twitter[0] != 'undefined'){
   if(k.urls.twitter[0].length>0)
       c=c+'&nbsp;<a href="'+k.urls.twitter[0]+'"><img src="images/twitter.png"></a>';  
  }
  if(typeof k.urls.facebook[0] != 'undefined'){
   if(k.urls.facebook[0].length>0)
       c=c+'&nbsp;<a href="'+k.urls.facebook[0]+'"><img src="images/facebook.png"></a>';  
  }  
  if(typeof k.urls.reddit[0] != 'undefined'){
   if(k.urls.reddit[0].length>0)
       c=c+'&nbsp;<a href="'+k.urls.reddit[0]+'"><img src="images/reddit.png"></a>';  
  }
  if(typeof k.urls.source_code[0] != 'undefined'){
   if(k.urls.source_code[0].length>0)
       c=c+'&nbsp;<a href="'+k.urls.source_code[0]+'"><img src="images/github.png"></a>';  
  }
  if(typeof k.urls.chat[0] != 'undefined'){
   if(k.urls.chat[0].length>0)
       c=c+'&nbsp;<a href="'+k.urls.chat[0]+'"><img src="images/chat.png"></a>';  
  }
  if(typeof k.urls.explorer[0] != 'undefined'){
   if(k.urls.explorer[0].length>0)
       c=c+'&nbsp;<a href="'+k.urls.explorer[0]+'"><img src="images/explorer.png"></a>';  
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
    appName: 'Aisland dex',
    infuraId: '58ea4b33a1fc4534bb1d8e2983e51993',
    chains: [mainnet, polygon, celo,fantom,avalanche,bsc,optimism,arbitrum,goerli,polygonMumbai],
    walletConnectProjectId: '243a2d7fcdff36a840b899d68a4c9eed'
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