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

	temp = temp.substring(24);//取后20个字节
	console.log("ethereum style address","0x"+temp);
	return transferAddressFromEthToSPF(temp);
}

function doSHA256(msgBytes) {
	const msgHex = msgBytes.toString("hex");
	const hashHex = sha256('0x' + msgHex).replace(/^0x/, '')
	return Buffer.from(hashHex, "hex");
}

const calculationPrefix = "033cf5";
let transferAddressFromEthToSPF = function(ethAddress) {
	if(ethAddress.startsWith("0x")) {
		ethAddress = ethAddress.substring(2);
	}

	if(ethAddress.length != 40) {
		throw new Error("eth address length invalid");
	}

	const addressHex = calculationPrefix + ethAddress;
	const addressBytes = Buffer.from(addressHex, "hex");

	//get checksum
	let checkSum = doSHA256(doSHA256(addressBytes));
	checkSum = checkSum.subarray(0, 4);

	//将address和checksum组合，然后base58一下得到最终的地址
	let res = base58.encode58(Buffer.concat([addressBytes, checkSum]));
	return res;
}

let transferAddressFromSPFToETH = function(spfAddress) {
	let temp = base58.decode58(spfAddress);
	temp = Buffer.from(temp);

	let checkSum = temp.subarray(-4);
	let addressBytes = temp.subarray(0, temp.length - 4);
	if(!checkSum.equals(doSHA256(doSHA256(addressBytes)).subarray(0, 4))) {
		throw new Error("spf address checksum checking error");
	}

	let ethAddress = addressBytes.toString("hex");
	ethAddress = ethAddress.substring(calculationPrefix.length);
	ethAddress = "0x"+ethAddress;
	return ethAddress;
}

let isSPFAddressValid = function(spfAddress) {
	if(!spfAddress.startsWith("SPF")) {
		return false;
	}

	let temp = base58.decode58(spfAddress);
	temp = Buffer.from(temp);
	let checkSum = temp.subarray(-4);
	let addressBytes = temp.subarray(0, temp.length - 4);
	let checkOk = checkSum.equals(doSHA256(doSHA256(addressBytes)).subarray(0, 4))
	return checkOk;
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


let test = function() {
	console.log("is spf address valid?", isSPFAddressValid("SPFHiwAcPNSyc641exgxJXF9pKshKHPDQBNm"));
	console.log("is spf address valid?", isSPFAddressValid("SPFHiwAcPNSyc641exgxJXF9pKshKHPDQBNM"));
	console.log("is spf address valid?", isSPFAddressValid("SPFHiwAcPNSyc641exgxJXF9pKshKHPDQBNu"));

	console.log(transferAddressFromSPFToETH("SPFBjgqUj3s9cHxkZAY9M3Ce4eoD37awVqcQ"));
	console.log(transferAddressFromEthToSPF("0xad8b5eb4fdb274c3c40d10cc9c5266f7b0f7546f"));
	console.log(transferAddressFromEthToSPF("0x1C98481D19cAC17C029dcCA8494279828418d4EB"));
	console.log(transferAddressFromEthToSPF("0x8D6EF00FD445982f4F49f889f6F168bfF8c9548F"));
	console.log(transferAddressFromEthToSPF("0xCd6A2A9772426fB9f759A6157A4CC5530b6674fe"));
	console.log(transferAddressFromEthToSPF("0x44f6812d7ae6f17F4963fC349652696BF9bc9307"));


	console.log(transferAddressFromSPFToETH("SPFHiwAcPNSyc641exgxJXF9pKshKHPDQBNm"));
	console.log(transferAddressFromEthToSPF("0xb91944FEf72B09629b5Cf79b134f20bD722F9d82"));
	console.log(transferAddressFromEthToSPF("0xC670813707C92dC82a43f741008D711bD2249bd8"));
	console.log(transferAddressFromEthToSPF("0xf6ae36ddde5b4986169e072be691a83c46123d4d"));
	console.log(transferAddressFromEthToSPF("0x60aa7e50f78b2f9a6d4874be181900aa08813c45"));

	console.log("0x25F2B419c513388fDFEE12982Baa3fA8153Be038",transferAddressFromEthToSPF("0x25F2B419c513388fDFEE12982Baa3fA8153Be038"));
	console.log("SPF8TzD6eeLFPX1nxan7fnF9HnXJ2DoFoWEr", transferAddressFromSPFToETH("SPF8TzD6eeLFPX1nxan7fnF9HnXJ2DoFoWEr"))

	console.log("0x6434d82cd9fbde6c0df74d7615cc321023a39473",transferAddressFromEthToSPF("0x6434d82cd9fbde6c0df74d7615cc321023a39473"));
	console.log("SPFE9BLYTJvX7cmSM7KpwW1iXw1GmBuEeaZi",transferAddressFromSPFToETH("SPFE9BLYTJvX7cmSM7KpwW1iXw1GmBuEeaZi"));

	console.log(transferAddressFromEthToSPF("0x743ea61bf8C26Aeabca021F2535da813b6B01f6D"));

	console.log(transferAddressFromEthToSPF("0xE9C8437c549d19703e5F4eC7Ad8c7F23E8af37b4"));

}

test();
