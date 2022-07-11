const { randomBytes } = require('crypto');
const CryptoJS = require("crypto-js");
const secp256k1 = require('secp256k1');
const base58 = require("./base58");
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
function loadPrivateKeyFromHexString(hex_string) {
	if (hex_string.slice(0, 2) == '0x') {
		hex_string = hex_string.slice(2);
	}
	if (hex_string.length != 64) { //must 32B private key
		return null;
	}
	return Buffer.from(hex_string, 'hex');
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

function generateSPFAddress(public_key) {
	let temp = public_key;
	if (temp.length === 65) {
		temp = temp.slice(1); //去掉前缀
	}

	temp = keccak256(temp); //，32字节，十六进制64个字母表示
	if(temp.startsWith("0x")) {
		temp = temp.substring(2);
	}

	const addressHex = "033cf5" + temp.substring(24);//取后20个字节
	const addressBytes = Buffer.from(addressHex, "hex");

	//get checksum
	const hash0 = doSHA256(addressBytes);
	const hash1 = doSHA256(hash0);
	let checkSum = hash1.slice(0, 4);

	//将address和checksum组合，然后base58一下得到最终的地址
	let res = base58.encode58(Buffer.concat([addressBytes, checkSum]));
	return res;
}

function doSHA256(msgBytes) {
	const msgHex = msgBytes.toString("hex");
	const hashHex = sha256('0x' + msgHex).replace(/^0x/, '')
	return Buffer.from(hashHex, "hex");
}


//let private_key_hex = '616abd861dc63b5311980c4903ff7993b23f1d083c84f6f447bcc9d77c8921b4'; //32B, 256bit
//let private_key = loadPrivateKeyFromHexString(private_key_hex) //32B, 256bit
let private_key = generatePrivateKey();
let private_key_hex = private_key.toString("hex");
console.log("private key:", private_key_hex, "length is ", private_key.length);

let public_key = generatePublicKey(private_key);
console.log("public key:", Buffer.from(public_key).toString("hex"), "length is ", public_key.length);

let address = generateSPFAddress(public_key);
console.log("SPF address:", address);



