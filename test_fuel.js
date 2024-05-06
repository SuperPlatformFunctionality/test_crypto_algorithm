const walletKey = require("./walletKey.js");
const fuels = require("fuels");

// Random Wallet
//console.log(fuels.Wallet.generate());

// Using privateKey Wallet
let priKey = walletKey.priKey;
console.log("priKey is", priKey);

let theWalletUnlocked = fuels.Wallet.fromPrivateKey(priKey);
console.log(theWalletUnlocked);
console.log(theWalletUnlocked.address.toB256());
console.log("the private key from the unlocked wallet", theWalletUnlocked.signer().privateKey);

let theWalletLocked = fuels.Wallet.fromAddress(theWalletUnlocked.address);
console.log(theWalletLocked);
