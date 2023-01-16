const bip39 = require("bip39");
const ethers = require("ethers");

// generate a random mnemonic (uses crypto.randomBytes under the hood), defaults to 128-bits of entropy
let mnemonic = bip39.generateMnemonic();
console.log("mnemonic : ", mnemonic);
console.log("is valid : ", bip39.validateMnemonic(mnemonic));  //test the mnemonic word validation

//
let seed = bip39.mnemonicToSeedSync("pond across joke machine pink input letter couch lizard safe body squeeze").toString('hex');
console.log("seed:", seed);

// load mnemonic word
let mnemonicWallet = ethers.Wallet.fromMnemonic(mnemonic);  //use default path m/44’/60’/0’/0/0
console.log("private key:", mnemonicWallet.privateKey);
console.log("address:", mnemonicWallet.address);

