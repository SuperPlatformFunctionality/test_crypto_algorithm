const bip39 = require("bip39");
const ethers = require("ethers");

// Generate a random mnemonic (uses crypto.randomBytes under the hood), defaults to 128-bits of entropy
let mnemonic = bip39.generateMnemonic()
console.log(mnemonic);
console.log(bip39.validateMnemonic(mnemonic));  //test the mnemonic word validation

//let seed = bip39.mnemonicToSeedSync(mnemonic).toString('hex');
//console.log(seed);

//load mnemonic word
let mnemonicWallet = ethers.Wallet.fromMnemonic(mnemonic);  //use default path m/44’/60’/0’/0/0
console.log(mnemonicWallet.address);
console.log(mnemonicWallet.privateKey);
