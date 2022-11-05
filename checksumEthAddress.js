//EIP-55规范??
const createKeccakHash = require('keccak');

function toChecksumAddress (address) {
    address = address.toLowerCase().replace('0x', '')
    let hash = createKeccakHash('keccak256').update(address).digest('hex')
    let ret = '0x'

    for (let i = 0; i < address.length; i++) {
        if (parseInt(hash[i], 16) >= 8) {
            ret += address[i].toUpperCase()
        } else {
            ret += address[i]
        }
    }
    return ret
}

let tgtAddress = "0x2e1a65f9b646084b111921b6740f8285b0108dfb";
console.log(toChecksumAddress(tgtAddress));