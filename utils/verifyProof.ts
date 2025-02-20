// const { keccak256 } = require('ethereum-cryptography/keccak');
import { keccak256 } from 'ethereum-cryptography/keccak.js';
import {hexToBytes, bytesToHex} from 'ethereum-cryptography/utils.js'
const concat = (left, right) => keccak256(Buffer.concat([left, right]));

function verifyProof(proof, leaf, root) {
	console.log(proof)
	let data = keccak256(Buffer.from(leaf));

	for (let i = 0; i < proof.length; i++) {
		if (proof[i].left) {
			data = concat(hexToBytes(proof[i].data), data);
		} else {
			data = concat(data, hexToBytes(proof[i].data));
		}
	}

	return bytesToHex(data) === root;
}

export default verifyProof
