import MerkleTree from "./MerkleTree.js";
import niceList from './niceList.json' assert { type: 'json' };
import verifyProof from "./verifyProof.js";

const merkleTree = new MerkleTree(niceList);

// get the root
const root = merkleTree.getRoot();

// find the proof that norman block is in the list
const Name = "Traci McDermott";
const index = niceList.findIndex((n) => n === Name);
const proof = merkleTree.getProof(index);

console.log(verifyProof(proof, Name, root)); // true, Norman Block is in the list!
