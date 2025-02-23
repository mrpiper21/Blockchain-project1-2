import express from "express";
import MerkleTree from "../utils/MerkleTree.js";
import niceList from "../utils/niceList.json" assert { type: "json" };
import verifyProof from "../utils/verifyProof.js";

const port = 1225;

const app = express();
app.use(express.json());

const merkleTree = new MerkleTree(niceList);
const MERKLE_ROOT = merkleTree.getRoot();

app.post("/gift", (req, res) => {
	const { name } = req.body;

	const nameIndex = niceList.findIndex((n) => n === name);
	const proof = merkleTree.getProof(nameIndex);

	const isValid = verifyProof(proof, name, MERKLE_ROOT);
	if (isValid) {
		res.send("You got a toy robot!");
	} else {
		res.send("You are not on the list :(");
	}
});

app.listen(port, () => {
	console.log(`Listening on port ${port}!`);
});
