const { Buffer } = require('buffer'); //可以省略

//Buffer为固定长度

//string转buffer
let buf1 = Buffer.from("123你好", "utf8");  		//如果是utf8(默认),utf16le,latin1,则理解为将string类型(uft16)转码为成第二个参数指定的编码格式
let buf2 = Buffer.from("414243444546", "hex");  //如果是hex,base64,base64url,则理解为二进制解码，对string表示的二进制进行解码，解码规则由第二个参数指定，然后返回解码的二进制Buffer对象

//buffer转string
let str11 = buf1.toString(); //默认utf8
let str12 = buf1.toString("utf8");  //
let str13 = buf1.toString("hex");
console.log(str11, str12, str13);

let str21 = buf2.toString();
let str22 = buf2.toString("utf8");  //猜想估计是，如果是utf8(默认),utf16le,latin1，buffer中的数据指定格式解释，并转码为string类型
let str23 = buf2.toString("hex"); 	//猜想估计是，如果是hex,base64,base64url,buffer中的二进制，转化为其指定格式字符串表示
console.log(str21, str22, str23);

console.log(typeof buf2, buf2);
for(const b of buf2) {
	console.log(typeof b, b.toString());
}

console.log(Buffer.isBuffer(buf1), Buffer.isBuffer(str11));

//buffer有以offset为参数的buffer.read, buffer.write方法，用于读写数据
