import express from 'express';
import MerkleTree from "../utils/MerkleTree.js";
import niceList from "../utils/niceList.json" assert { type: "json" };
import verifyProof from "../utils/verifyProof.js";

const port = 1225;

const app = express();
app.use(express.json());

// Create Merkle tree and get root
const merkleTree = new MerkleTree(niceList);
const MERKLE_ROOT = merkleTree.getRoot();

//#TODO: CONFIGURE SERVER TO CONVERT UNITARRAY8 to STRING TO BE ABLE TO RECIEVE REQUEST FROM THE WEB

app.post("/gift", (req, res) => {
  // Extract name from request body
  const { name } = req.body;
  
  // Validate input
  if (!name || typeof name !== 'string') {
    return res.status(400).json({ 
      error: "Please provide a valid name in the request body" 
    });
  }

  // Find name index in the nice list
  const nameIndex = niceList.findIndex((n) => n === name);
  
  // Check if name exists in the list
  if (nameIndex === -1) {
    return res.json({ 
      verified: false, 
      message: "You are not on the list :(" 
    });
  }
  
  try {
    // Get proof for this name
    const proof = merkleTree.getProof(nameIndex);
    
    // Verify proof against the root
    const isValid = verifyProof(proof, name, MERKLE_ROOT);
    
    if (isValid) {
      return res.json({ 
        verified: true, 
        message: "You got a toy robot!" 
      });
    } else {
      return res.json({ 
        verified: false, 
        message: "Proof verification failed" 
      });
    }
  } catch (error) {
    console.error("Error verifying proof:", error);
    return res.status(500).json({ 
      error: "An error occurred during verification" 
    });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});