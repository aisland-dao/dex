"use strict";(self.webpackChunkdex_ui=self.webpackChunkdex_ui||[]).push([[343],{59343:(e,t,n)=>{n.d(t,{WalletConnectModal:()=>c});var s=n(89342),a=Object.defineProperty,o=Object.getOwnPropertySymbols,r=Object.prototype.hasOwnProperty,i=Object.prototype.propertyIsEnumerable,l=(e,t,n)=>t in e?a(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n;class c{constructor(e){this.openModal=s.jb.open,this.closeModal=s.jb.close,this.subscribeModal=s.jb.subscribe,this.setTheme=s.ThemeCtrl.setThemeConfig,s.ThemeCtrl.setThemeConfig(e),s.ConfigCtrl.setConfig(((e,t)=>{for(var n in t||(t={}))r.call(t,n)&&l(e,n,t[n]);if(o)for(var n of o(t))i.call(t,n)&&l(e,n,t[n]);return e})({enableStandaloneMode:!0},e)),this.initUi()}async initUi(){if(typeof window<"u"){await n.e(44).then(n.bind(n,80044));const e=document.createElement("w3m-modal");document.body.insertAdjacentElement("beforeend",e),s.OptionsCtrl.setIsUiLoaded(!0)}}}},89342:(e,t,n)=>{n.d(t,{AccountCtrl:()=>L,Id:()=>b,ConfigCtrl:()=>O,zv:()=>C,uA:()=>I,ExplorerCtrl:()=>K,jb:()=>G,OptionsCtrl:()=>j,AV:()=>v,ThemeCtrl:()=>te,ToastCtrl:()=>se,WcConnectionCtrl:()=>F}),Symbol();const s=Symbol(),a=Object.getPrototypeOf,o=new WeakMap,r=(e,t=!0)=>{o.set(e,t)};var i=n(25108);const l=e=>"object"==typeof e&&null!==e,c=new WeakMap,d=new WeakSet,[u]=((e=Object.is,t=((e,t)=>new Proxy(e,t)),n=(e=>l(e)&&!d.has(e)&&(Array.isArray(e)||!(Symbol.iterator in e))&&!(e instanceof WeakMap)&&!(e instanceof WeakSet)&&!(e instanceof Error)&&!(e instanceof Number)&&!(e instanceof Date)&&!(e instanceof String)&&!(e instanceof RegExp)&&!(e instanceof ArrayBuffer)),i=(e=>{switch(e.status){case"fulfilled":return e.value;case"rejected":throw e.reason;default:throw e}}),u=new WeakMap,p=((e,t,n=i)=>{const s=u.get(e);if((null==s?void 0:s[0])===t)return s[1];const a=Array.isArray(e)?[]:Object.create(Object.getPrototypeOf(e));return r(a,!0),u.set(e,[t,a]),Reflect.ownKeys(e).forEach((t=>{if(Object.getOwnPropertyDescriptor(a,t))return;const s=Reflect.get(e,t),o={value:s,enumerable:!0,configurable:!0};if(d.has(s))r(s,!1);else if(s instanceof Promise)delete o.value,o.get=()=>n(s);else if(c.has(s)){const[e,t]=c.get(s);o.value=p(e,t(),n)}Object.defineProperty(a,t,o)})),a}),h=new WeakMap,f=[1,1],w=(r=>{if(!l(r))throw new Error("object required");const i=h.get(r);if(i)return i;let u=f[0];const g=new Set,b=(e,t=++f[0])=>{u!==t&&(u=t,g.forEach((n=>n(e,t))))};let m=f[1];const v=e=>(t,n)=>{const s=[...t];s[1]=[e,...s[1]],b(s,n)},C=new Map,y=e=>{var t;const n=C.get(e);n&&(C.delete(e),null==(t=n[1])||t.call(n))},I=Array.isArray(r)?[]:Object.create(Object.getPrototypeOf(r)),E=t(I,{deleteProperty(e,t){const n=Reflect.get(e,t);y(t);const s=Reflect.deleteProperty(e,t);return s&&b(["delete",[t],n]),s},set(t,r,i,u){const p=Reflect.has(t,r),f=Reflect.get(t,r,u);if(p&&(e(f,i)||h.has(i)&&e(f,h.get(i))))return!0;var m;y(r),l(i)&&(i=(e=>e&&(o.has(e)?o.get(e):a(e)===Object.prototype||a(e)===Array.prototype))(m=i)&&m[s]||null||i);let I=i;if(i instanceof Promise)i.then((e=>{i.status="fulfilled",i.value=e,b(["resolve",[r],e])})).catch((e=>{i.status="rejected",i.reason=e,b(["reject",[r],e])}));else{!c.has(i)&&n(i)&&(I=w(i));const e=!d.has(I)&&c.get(I);e&&((e,t)=>{if(C.has(e))throw new Error("prop listener already exists");if(g.size){const n=t[3](v(e));C.set(e,[t,n])}else C.set(e,[t])})(r,e)}return Reflect.set(t,r,I,u),b(["set",[r],i,f]),!0}});h.set(r,E);const j=[I,(e=++f[1])=>(m===e||g.size||(m=e,C.forEach((([t])=>{const n=t[1](e);n>u&&(u=n)}))),u),p,e=>(g.add(e),1===g.size&&C.forEach((([e,t],n)=>{if(t)throw new Error("remove already exists");const s=e[3](v(n));C.set(n,[e,s])})),()=>{g.delete(e),0===g.size&&C.forEach((([e,t],n)=>{t&&(t(),C.set(n,[e]))}))})];return c.set(E,j),Reflect.ownKeys(r).forEach((e=>{const t=Object.getOwnPropertyDescriptor(r,e);"value"in t&&(E[e]=r[e],delete t.value,delete t.writable),Object.defineProperty(I,e,t)})),E}))=>[w,c,d,e,t,n,i,u,p,h,f])();function p(e={}){return u(e)}function h(e,t,n){const s=c.get(e);let a;s||i.warn("Please use proxy object");const o=[],r=s[3];let l=!1;const d=r((e=>{o.push(e),n?t(o.splice(0)):a||(a=Promise.resolve().then((()=>{a=void 0,l&&t(o.splice(0))})))}));return l=!0,()=>{l=!1,d()}}var f=n(48764),w=n(25108);let g;const b={ethereumClient:void 0,setEthereumClient(e){g=e},client(){if(g)return g;throw new Error("ClientCtrl has no client set")}},m=p({history:["ConnectWallet"],view:"ConnectWallet",data:void 0}),v={state:m,subscribe:e=>h(m,(()=>e(m))),push(e,t){e!==m.view&&(m.view=e,t&&(m.data=t),m.history.push(e))},reset(e){m.view=e,m.history=[e]},replace(e){m.history.length>1&&(m.history[m.history.length-1]=e,m.view=e)},goBack(){if(m.history.length>1){m.history.pop();const[e]=m.history.slice(-1);m.view=e}},setData(e){m.data=e}},C={WALLETCONNECT_DEEPLINK_CHOICE:"WALLETCONNECT_DEEPLINK_CHOICE",W3M_VERSION:"W3M_VERSION",W3M_PREFER_INJECTED_URL_FLAG:"w3mPreferInjected",RECOMMENDED_WALLET_AMOUNT:9,isMobile:()=>typeof window<"u"&&Boolean(window.matchMedia("(pointer:coarse)").matches||/Android|webOS|iPhone|iPad|iPod|BlackBerry|Opera Mini/u.test(navigator.userAgent)),isAndroid:()=>C.isMobile()&&navigator.userAgent.toLowerCase().includes("android"),isIos(){const e=navigator.userAgent.toLowerCase();return C.isMobile()&&(e.includes("iphone")||e.includes("ipad"))},isHttpUrl:e=>e.startsWith("http://")||e.startsWith("https://"),isArray:e=>Array.isArray(e)&&e.length>0,formatNativeUrl(e,t,n){if(C.isHttpUrl(e))return this.formatUniversalUrl(e,t,n);let s=e;return s.includes("://")||(s=e.replaceAll("/","").replaceAll(":",""),s=`${s}://`),s.endsWith("/")||(s=`${s}/`),this.setWalletConnectDeepLink(s,n),`${s}wc?uri=${encodeURIComponent(t)}`},formatUniversalUrl(e,t,n){if(!C.isHttpUrl(e))return this.formatNativeUrl(e,t,n);let s=e;return s.endsWith("/")||(s=`${s}/`),this.setWalletConnectDeepLink(s,n),`${s}wc?uri=${encodeURIComponent(t)}`},wait:async e=>new Promise((t=>{setTimeout(t,e)})),openHref(e,t){window.open(e,t,"noreferrer noopener")},setWalletConnectDeepLink(e,t){localStorage.setItem(C.WALLETCONNECT_DEEPLINK_CHOICE,JSON.stringify({href:e,name:t}))},setWalletConnectAndroidDeepLink(e){const[t]=e.split("?");localStorage.setItem(C.WALLETCONNECT_DEEPLINK_CHOICE,JSON.stringify({href:t,name:"Android"}))},removeWalletConnectDeepLink(){localStorage.removeItem(C.WALLETCONNECT_DEEPLINK_CHOICE)},setWeb3ModalVersionInStorage(){typeof localStorage<"u"&&localStorage.setItem(C.W3M_VERSION,"2.4.6-66c5c638")},getWalletRouterData(){var e;const t=null==(e=v.state.data)?void 0:e.Wallet;if(!t)throw new Error('Missing "Wallet" view data');return t},getSwitchNetworkRouterData(){var e;const t=null==(e=v.state.data)?void 0:e.SwitchNetwork;if(!t)throw new Error('Missing "SwitchNetwork" view data');return t},isPreferInjectedFlag:()=>typeof location<"u"&&new URLSearchParams(location.search).has(C.W3M_PREFER_INJECTED_URL_FLAG)},y=p({enabled:typeof location<"u"&&(location.hostname.includes("localhost")||location.protocol.includes("https")),userSessionId:"",events:[],connectedWalletId:void 0}),I={state:y,subscribe:e=>h(y.events,(()=>e(function(e,t){const n=c.get(e);n||i.warn("Please use proxy object");const[s,a,o]=n;return o(s,a(),void 0)}(y.events[y.events.length-1])))),initialize(){y.enabled&&typeof crypto<"u"&&(y.userSessionId=crypto.randomUUID())},setConnectedWalletId(e){y.connectedWalletId=e},click(e){if(y.enabled){const t={type:"CLICK",name:e.name,userSessionId:y.userSessionId,timestamp:Date.now(),data:e};y.events.push(t)}},track(e){if(y.enabled){const t={type:"TRACK",name:e.name,userSessionId:y.userSessionId,timestamp:Date.now(),data:e};y.events.push(t)}},view(e){if(y.enabled){const t={type:"VIEW",name:e.name,userSessionId:y.userSessionId,timestamp:Date.now(),data:e};y.events.push(t)}}},E=p({selectedChain:void 0,chains:void 0,standaloneChains:void 0,standaloneUri:void 0,isStandalone:!1,isAuth:!1,isCustomDesktop:!1,isCustomMobile:!1,isDataLoaded:!1,isUiLoaded:!1,isPreferInjected:!1,walletConnectVersion:1}),j={state:E,subscribe:e=>h(E,(()=>e(E))),setChains(e){E.chains=e},setStandaloneChains(e){E.standaloneChains=e},setStandaloneUri(e){E.standaloneUri=e},getSelectedChain(){const e=b.client().getNetwork().chain;return e&&(E.selectedChain=e),E.selectedChain},setSelectedChain(e){E.selectedChain=e},setIsStandalone(e){E.isStandalone=e},setIsCustomDesktop(e){E.isCustomDesktop=e},setIsCustomMobile(e){E.isCustomMobile=e},setIsDataLoaded(e){E.isDataLoaded=e},setIsUiLoaded(e){E.isUiLoaded=e},setWalletConnectVersion(e){E.walletConnectVersion=e},setIsPreferInjected(e){E.isPreferInjected=e},setIsAuth(e){E.isAuth=e}},W=p({projectId:"",mobileWallets:void 0,desktopWallets:void 0,walletImages:void 0,chainImages:void 0,tokenImages:void 0,tokenContracts:void 0,standaloneChains:void 0,enableStandaloneMode:!1,enableAuthMode:!1,enableNetworkView:!1,enableAccountView:!0,enableExplorer:!0,defaultChain:void 0,explorerExcludedWalletIds:void 0,explorerRecommendedWalletIds:void 0,termsOfServiceUrl:void 0,privacyPolicyUrl:void 0}),O={state:W,subscribe:e=>h(W,(()=>e(W))),setConfig(e){var t,n,s,a;I.initialize(),j.setStandaloneChains(e.standaloneChains),j.setIsStandalone(Boolean(null==(t=e.standaloneChains)?void 0:t.length)||Boolean(e.enableStandaloneMode)),j.setIsAuth(Boolean(e.enableAuthMode)),j.setIsCustomMobile(Boolean(null==(n=e.mobileWallets)?void 0:n.length)),j.setIsCustomDesktop(Boolean(null==(s=e.desktopWallets)?void 0:s.length)),j.setWalletConnectVersion(null!=(a=e.walletConnectVersion)?a:1),j.state.isStandalone||(j.setChains(b.client().chains),j.setIsPreferInjected(b.client().isInjectedProviderInstalled()&&C.isPreferInjectedFlag())),e.defaultChain&&j.setSelectedChain(e.defaultChain),C.setWeb3ModalVersionInStorage(),Object.assign(W,e)}},A=p({address:void 0,profileName:void 0,profileAvatar:void 0,profileLoading:!1,balanceLoading:!1,balance:void 0,isConnected:!1}),L={state:A,subscribe:e=>h(A,(()=>e(A))),getAccount(){const e=b.client().getAccount();A.address=e.address,A.isConnected=e.isConnected},async fetchProfile(e,t){var n;try{A.profileLoading=!0;const s=t??A.address,a=null==(n=j.state.chains)?void 0:n.find((e=>1===e.id));if(s&&a){const t=await b.client().fetchEnsName({address:s,chainId:1});if(t){const n=await b.client().fetchEnsAvatar({name:t,chainId:1});n&&await e(n),A.profileAvatar=n}A.profileName=t}}finally{A.profileLoading=!1}},async fetchBalance(e){try{const{chain:t}=b.client().getNetwork(),{tokenContracts:n}=O.state;let s;t&&n&&(s=n[t.id]),A.balanceLoading=!0;const a=e??A.address;if(a){const e=await b.client().fetchBalance({address:a,token:s});A.balance={amount:e.formatted,symbol:e.symbol}}}finally{A.balanceLoading=!1}},setAddress(e){A.address=e},setIsConnected(e){A.isConnected=e},resetBalance(){A.balance=void 0},resetAccount(){A.address=void 0,A.isConnected=!1,A.profileName=void 0,A.profileAvatar=void 0,A.balance=void 0}},S="https://explorer-api.walletconnect.com";async function P(e,t){const n=new URL(e,S);return n.searchParams.append("projectId",O.state.projectId),Object.entries(t).forEach((([e,t])=>{t&&n.searchParams.append(e,String(t))})),(await fetch(n)).json()}const M=async e=>P("/w3m/v1/getDesktopListings",e),k=async e=>P("/w3m/v1/getMobileListings",e),N=async e=>P("/w3m/v1/getInjectedListings",e),U=async e=>P("/w3m/v1/getAllListings",e),D=e=>`${S}/w3m/v1/getWalletImage/${e}?projectId=${O.state.projectId}`,R=e=>`${S}/w3m/v1/getAssetImage/${e}?projectId=${O.state.projectId}`;var _=Object.defineProperty,T=Object.getOwnPropertySymbols,x=Object.prototype.hasOwnProperty,V=Object.prototype.propertyIsEnumerable,B=(e,t,n)=>t in e?_(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n;const $=C.isMobile(),H=p({wallets:{listings:[],total:0,page:1},injectedWallets:[],search:{listings:[],total:0,page:1},recomendedWallets:[]}),K={state:H,async getRecomendedWallets(){const{explorerRecommendedWalletIds:e,explorerExcludedWalletIds:t}=O.state;if("NONE"===e||"ALL"===t&&!e)return H.recomendedWallets;if(C.isArray(e)){const t={recommendedIds:e.join(",")},{listings:n}=await U(t),s=Object.values(n);s.sort(((t,n)=>e.indexOf(t.id)-e.indexOf(n.id))),H.recomendedWallets=s}else{const{standaloneChains:e,walletConnectVersion:n,isAuth:s}=j.state,a=e?.join(","),o=C.isArray(t),r={page:1,sdks:s?"auth_v1":void 0,entries:C.RECOMMENDED_WALLET_AMOUNT,chains:a,version:n,excludedIds:o?t.join(","):void 0},{listings:i}=$?await k(r):await M(r);H.recomendedWallets=Object.values(i)}return H.recomendedWallets},async getWallets(e){const t=((e,t)=>{for(var n in t||(t={}))x.call(t,n)&&B(e,n,t[n]);if(T)for(var n of T(t))V.call(t,n)&&B(e,n,t[n]);return e})({},e),{explorerRecommendedWalletIds:n,explorerExcludedWalletIds:s}=O.state,{recomendedWallets:a}=H;if("ALL"===s)return H.wallets;t.search||(a.length?t.excludedIds=a.map((e=>e.id)).join(","):C.isArray(n)&&(t.excludedIds=n.join(","))),C.isArray(s)&&(t.excludedIds=[t.excludedIds,s].filter(Boolean).join(",")),j.state.isAuth&&(t.sdks="auth_v1");const{page:o,search:r}=e,{listings:i,total:l}=$?await k(t):await M(t),c=Object.values(i),d=r?"search":"wallets";return H[d]={listings:[...H[d].listings,...c],total:l,page:o??1},{listings:c,total:l}},async getInjectedWallets(){const{listings:e}=await N({}),t=Object.values(e);return H.injectedWallets=t,H.injectedWallets},getWalletImageUrl:e=>D(e),getAssetImageUrl:e=>R(e),resetSearch(){H.search={listings:[],total:0,page:1}}},z=p({pairingEnabled:!1,pairingUri:"",pairingError:!1}),F={state:z,subscribe:e=>h(z,(()=>e(z))),setPairingUri(e){z.pairingUri=e},setPairingError(e){z.pairingError=e},setPairingEnabled(e){z.pairingEnabled=e}},J=p({open:!1}),G={state:J,subscribe:e=>h(J,(()=>e(J))),open:async e=>new Promise((t=>{const{isStandalone:n,isUiLoaded:s,isDataLoaded:a,isPreferInjected:o,selectedChain:r}=j.state,{isConnected:i}=L.state,{enableNetworkView:l}=O.state;if(n||F.setPairingEnabled(!0),n)j.setStandaloneUri(e?.uri),j.setStandaloneChains(e?.standaloneChains),v.reset("ConnectWallet");else if(null!=e&&e.route)v.reset(e.route);else if(i)v.reset("Account");else if(l)v.reset("SelectNetwork");else{if(o)return b.client().connectConnector("injected",r?.id).catch((e=>w.error(e))),void t();v.reset("ConnectWallet")}const{pairingUri:c}=F.state;if(s&&a&&(n||c||i))J.open=!0,t();else{const e=setInterval((()=>{const n=j.state,s=F.state;n.isUiLoaded&&n.isDataLoaded&&(n.isStandalone||s.pairingUri||i)&&(clearInterval(e),J.open=!0,t())}),200)}})),close(){J.open=!1}};var q=Object.defineProperty,Q=Object.getOwnPropertySymbols,X=Object.prototype.hasOwnProperty,Y=Object.prototype.propertyIsEnumerable,Z=(e,t,n)=>t in e?q(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n;const ee=p({themeMode:typeof matchMedia<"u"&&matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}),te={state:ee,subscribe:e=>h(ee,(()=>e(ee))),setThemeConfig(e){const{themeMode:t,themeVariables:n}=e;t&&(ee.themeMode=t),n&&(ee.themeVariables=((e,t)=>{for(var n in t||(t={}))X.call(t,n)&&Z(e,n,t[n]);if(Q)for(var n of Q(t))Y.call(t,n)&&Z(e,n,t[n]);return e})({},n))}},ne=p({open:!1,message:"",variant:"success"}),se={state:ne,subscribe:e=>h(ne,(()=>e(ne))),openToast(e,t){ne.open=!0,ne.message=e,ne.variant=t},closeToast(){ne.open=!1}};typeof window<"u"&&(window.Buffer||(window.Buffer=f.Buffer),window.global||(window.global=window),window.process||(window.process={env:{}}),window.global||(window.global=window))}}]);