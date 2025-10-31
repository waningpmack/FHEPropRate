const { ethers } = require("hardhat");

async function main() {
  const [signer] = await ethers.getSigners();
  console.log("Signer:", signer.address);

  const contract = await ethers.getContractAt("PropertyRatingContract", "0xd4B5327816E08cce36F7D537c43939f5229572D1", signer);

  console.log("Testing createProject with frontend params...");

  try {
    const tx = await contract.createProject(
      "rwe",
      "rwe",
      "rwe",
      '["Location", "Quality", "Amenities", "Transport", "Value", "Potential"]',
      604800
    );

    console.log("Transaction hash:", tx.hash);
    console.log("Data length:", tx.data.length);

    const receipt = await tx.wait();
    console.log("Success! Block:", receipt.blockNumber);
  } catch (error) {
    console.error("Error:", error.message);
    if (error.data) {
      console.error("Error data:", error.data);
    }
  }
}

main().catch(console.error);

