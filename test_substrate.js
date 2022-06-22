//let crypto = require('crypto');  //加载crypto库
//console.log(crypto.getHashes()); //打印支持的hash算法
//console.log(crypto.getCiphers());
//console.log(crypto.getCurves());

const bs58 = require('bs58')
let blake2 = require('blake2');

//for substract address calculation
let prefix = "00";
let pubkey = "54902ac86eb3bc2e1ecf30533e2d9f1f1b034ac0dd35ff41f44da47384646169";
let data = prefix + pubkey;

let h = blake2.createHash('blake2b');
h.update(Buffer.from('53533538505245'+ data, 'hex'));
let checksum = h.digest("hex").substring(0, 4);
console.log("checksum:", checksum);
const bytes = Buffer.from(data + checksum, 'hex')
const address = bs58.encode(bytes)
console.log("address:", address);

