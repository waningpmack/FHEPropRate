const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Testing with account:", deployer.address);

  const PropertyRatingContract = await ethers.getContractFactory("PropertyRatingContract");
  const contract = PropertyRatingContract.attach("0xB6339060Da3d5a9906A8E5D3C4a06641713C5CA4");

  console.log("Contract address:", contract.target);

  // First test if we can read any public variable
  try {
    const nextId = await contract.nextProjectId();
    console.log("nextProjectId:", nextId.toString());
  } catch (error) {
    console.error("nextProjectId failed:", error.message);
  }

  try {
    // Test getProjectCount
    const count = await contract.getProjectCount();
    console.log("Project count:", count.toString());
  } catch (error) {
    console.error("getProjectCount failed:", error.message);
  }

  // Test createProject
  console.log("Testing createProject...");
  try {
    console.log("Contract address:", contract.target);
    console.log("Calling createProject with params:");
    console.log("- name:", "Test Project");
    console.log("- description:", "Test Description");
    console.log("- location:", "Test Location");
    console.log("- dimensions:", '["Location", "Quality", "Amenities", "Transport", "Value", "Potential"]');
    console.log("- duration:", 86400);

    const tx = await contract.createProject(
      "Test Project",
      "Test Description",
      "Test Location",
      '["Location", "Quality", "Amenities", "Transport", "Value", "Potential"]',
      86400
    );
    console.log("Transaction sent:", tx.hash);
    console.log("Transaction data length:", tx.data.length);
    const receipt = await tx.wait();
    console.log("Project created successfully! Block:", receipt?.blockNumber);
  } catch (error) {
    console.error("createProject failed:", error.message);
    console.error("Error details:", error);
    console.error("Error code:", error.code);
    console.error("Error data:", error.data);
  }

  // Check count again
  const newCount = await contract.getProjectCount();
  console.log("New project count:", newCount.toString());

  // Get project info
  const info = await contract.getProjectInfo(1);
  console.log("Project info:", info);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
