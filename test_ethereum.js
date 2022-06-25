const { randomBytes } = require('crypto');
const CryptoJS = require("crypto-js");
const secp256k1 = require('secp256k1');
const SHA3 = require('keccakjs');
const {keccak256, sha256} = require('./ethersUtils');

//生成随机私钥, 长度256bit, 32B
function generatePrivateKey() {
	let private_key
	do {
		private_key = randomBytes(32)
	} while (!secp256k1.privateKeyVerify(private_key));
	return private_key
}

//导入16进制编码的私钥
//e.g. openssl rand -hex 32
function loadPrivateKeyFromHexString(hex_string) {
	if (hex_string.slice(0, 2) == '0x') {
		hex_string = hex_string.slice(2);
	}
	if (hex_string.length != 64) {
		return null;
	}
	return Buffer.from(hex_string, 'hex')
}

/*
 * 公钥：在secp256k1规范下，由私钥和规范中指定的生成点计算出的坐标(x, y)
 *      非压缩格式公钥： [前缀0x04] + x + y (65字节)
 *      压缩格式公钥：[前缀0x02或0x03] + x ，其中前缀取决于 y 的符号
 */
//生成公钥: 输入的私钥应当是buffer
function generatePublicKey(private_key, compressed = false) {
	let public_key = secp256k1.publicKeyCreate(private_key, compressed)
	return public_key //包含了前缀
}

/*
 * 地址：公钥的sha3-256编码的后20字节，16进制编码的字符串
 */
function generateEthAddress(public_key) {
	let res = public_key.slice(1); //去掉前缀
	/*
	let h = new SHA3(256);
	h.update(tmp);
	let res = h.digest('hex');
	*/
	//SHA3标准化之前，SHA3就是keccak256算法，所以在Ethereum和Solidity智能合约代码中的SHA3是指Keccak256，标准化之后SHA3貌似值得是另一种hash算法
	//为了避免混淆，直接在合约代码中写成Keccak256是最清晰的
	res = keccak256(res);
	res = res.slice(-40) 	//取后20字节, 160bit
	return "0x" + res;
}


//let private_key_hex = ''; //32B, 256bit
//let private_key = loadPrivateKeyFromHexString(private_key_hex) //32B, 256bit
let private_key = generatePrivateKey()
console.log("private key:",private_key.toString("hex"), "length is ", private_key.length);

let public_key = generatePublicKey(private_key);
console.log("public key:", Buffer.from(public_key).toString("hex"), "length is ", public_key.length);

let address = generateEthAddress(public_key)
console.log("ethereum address:", address);

//以太坊
//32字节私钥,(十六进制,64个字母表示)
//
//20字节地址,(十六进制,40个字母表示)
