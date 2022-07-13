const { randomBytes } = require('crypto');
const secp256k1 = require('secp256k1');
let { encrypt, decrypt, PrivateKey } = require('eciesjs');

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
	if (hex_string.length != 64) {
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


//ECC secp256k1 算法
console.log("in common...");

//let private_key_hex = '616abd861dc63b5311980c4903ff7993b23f1d083c84f6f447bcc9d77c8921b4'; //32B, 256bit
//let private_key = loadPrivateKeyFromHexString(private_key_hex) //32B, 256bit
let private_key = generatePrivateKey();
let private_key_hex = private_key.toString("hex");

console.log("private key:", private_key_hex, "length is ", private_key.length);
let public_key = generatePublicKey(private_key);
console.log("public key (非压缩格式):", Buffer.from(public_key).toString("hex"), "length is ", public_key.length);


console.log("use ecies...");
const k1 = PrivateKey.fromHex(private_key_hex);

console.log("private key", k1.toHex());
console.log("public key (非压缩格式)", k1.publicKey.toHex());

let originText = 'this is a test';
const originalData = Buffer.from(originText);
console.log("originalData", originalData);

let encryptedData = encrypt(k1.publicKey.toHex(), originalData);
console.log("encryptedData", encryptedData, encryptedData.length);

let decryptedData = decrypt(k1.toHex(), encryptedData);
console.log("decryptedData", decryptedData);

let decryptedText = decryptedData.toString()
console.log("decryptedText", decryptedText);

