const bs58 = require('bs58')
let blake2 = require('blake2');
const base58 = require("./base58");

let public_key = "54902ac86eb3bc2e1ecf30533e2d9f1f1b034ac0dd35ff41f44da47384646169";
console.log("public key", public_key);

let prefix = "00";
console.log("use prefix:", prefix);

let data = prefix + public_key;

let h = blake2.createHash('blake2b');
h.update(Buffer.from('53533538505245'+ data, 'hex'));
let checksum = h.digest("hex").substring(0, 4);
console.log("checksum:", checksum);

const bytes = Buffer.from(data + checksum, 'hex')
const address = bs58.encode(bytes)
const address2 = base58.encode58(bytes);
console.log("substrate address:", address, address2);
