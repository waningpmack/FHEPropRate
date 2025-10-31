import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { ethers, fhevm } from "hardhat";
import { PropertyRatingContract, PropertyRatingContract__factory } from "../types";
import { expect } from "chai";
import { FhevmType } from "@fhevm/hardhat-plugin";

type Signers = {
  deployer: HardhatEthersSigner;
  alice: HardhatEthersSigner;
  bob: HardhatEthersSigner;
  charlie: HardhatEthersSigner;
};

async function deployFixture() {
  const factory = (await ethers.getContractFactory("PropertyRatingContract")) as PropertyRatingContract__factory;
  const propertyRatingContract = (await factory.deploy()) as PropertyRatingContract;
  const propertyRatingContractAddress = await propertyRatingContract.getAddress();

  return { propertyRatingContract, propertyRatingContractAddress };
}

describe("PropertyRatingContract", function () {
  let signers: Signers;
  let propertyRatingContract: PropertyRatingContract;
  let propertyRatingContractAddress: string;

  before(async function () {
    const ethSigners: HardhatEthersSigner[] = await ethers.getSigners();
    signers = {
      deployer: ethSigners[0],
      alice: ethSigners[1],
      bob: ethSigners[2],
      charlie: ethSigners[3]
    };
  });

  beforeEach(async function () {
    // Check whether the tests are running against an FHEVM mock environment
    if (!fhevm.isMock) {
      console.warn(`This hardhat test suite cannot run on Sepolia Testnet`);
      this.skip();
    }

    ({ propertyRatingContract, propertyRatingContractAddress } = await deployFixture());
  });

  describe("Project Creation", function () {
    it("should create a new rating project", async function () {
      const projectName = "Test Property";
      const projectDescription = "A test property for rating";
      const location = "Downtown Area";
      const dimensions = '["location", "quality", "amenities", "transport", "value", "potential"]';
      const duration = 86400; // 1 day

      const tx = await propertyRatingContract
        .connect(signers.alice)
        .createProject(projectName, projectDescription, location, dimensions, duration);

      await expect(tx).to.emit(propertyRatingContract, "ProjectCreated");

      const projectCount = await propertyRatingContract.getProjectCount();
      expect(projectCount).to.eq(1);

      const [name, description, loc, dims, deadline, creator] = await propertyRatingContract.getProjectInfo(1);
      expect(name).to.eq(projectName);
      expect(description).to.eq(projectDescription);
      expect(creator).to.eq(signers.alice.address);
    });
  });

  describe("Rating Submission", function () {
    let projectId: number;

    beforeEach(async function () {
      // Create a project first
      const tx = await propertyRatingContract
        .connect(signers.alice)
        .createProject("Test Project", "Description", "Location", "[]", 86400);
      await tx.wait();

      projectId = 1;
    });

    it("should allow user to submit encrypted ratings", async function () {
      // Create encrypted ratings (all scores = 5)
      const encryptedFive = await fhevm
        .createEncryptedInput(propertyRatingContractAddress, signers.bob.address)
        .add32(5)
        .encrypt();

      const tx = await propertyRatingContract
        .connect(signers.bob)
        .submitRating(
          projectId,
          encryptedFive.handles[0], encryptedFive.inputProof, // location
          encryptedFive.handles[0], encryptedFive.inputProof, // quality
          encryptedFive.handles[0], encryptedFive.inputProof, // amenities
          encryptedFive.handles[0], encryptedFive.inputProof, // transport
          encryptedFive.handles[0], encryptedFive.inputProof, // value
          encryptedFive.handles[0], encryptedFive.inputProof  // potential
        );

      await expect(tx).to.emit(propertyRatingContract, "RatingSubmitted");

      // Check if user has rated
      const hasRated = await propertyRatingContract.hasUserRated(projectId, signers.bob.address);
      expect(hasRated).to.be.true;
    });

    it("should prevent double rating", async function () {
      // First rating
      const encryptedFive = await fhevm
        .createEncryptedInput(propertyRatingContractAddress, signers.bob.address)
        .add32(5)
        .encrypt();

      await propertyRatingContract
        .connect(signers.bob)
        .submitRating(
          projectId,
          encryptedFive.handles[0], encryptedFive.inputProof,
          encryptedFive.handles[0], encryptedFive.inputProof,
          encryptedFive.handles[0], encryptedFive.inputProof,
          encryptedFive.handles[0], encryptedFive.inputProof,
          encryptedFive.handles[0], encryptedFive.inputProof,
          encryptedFive.handles[0], encryptedFive.inputProof
        );

      // Second rating should fail
      await expect(
        propertyRatingContract
          .connect(signers.bob)
          .submitRating(
            projectId,
            encryptedFive.handles[0], encryptedFive.inputProof,
            encryptedFive.handles[0], encryptedFive.inputProof,
            encryptedFive.handles[0], encryptedFive.inputProof,
            encryptedFive.handles[0], encryptedFive.inputProof,
            encryptedFive.handles[0], encryptedFive.inputProof,
            encryptedFive.handles[0], encryptedFive.inputProof
          )
      ).to.be.reverted;
    });

    it("should update project statistics correctly", async function () {
      // Alice submits rating: all 8s (total = 48)
      const encryptedEight = await fhevm
        .createEncryptedInput(propertyRatingContractAddress, signers.alice.address)
        .add32(8)
        .encrypt();

      await propertyRatingContract
        .connect(signers.alice)
        .submitRating(
          projectId,
          encryptedEight.handles[0], encryptedEight.inputProof,
          encryptedEight.handles[0], encryptedEight.inputProof,
          encryptedEight.handles[0], encryptedEight.inputProof,
          encryptedEight.handles[0], encryptedEight.inputProof,
          encryptedEight.handles[0], encryptedEight.inputProof,
          encryptedEight.handles[0], encryptedEight.inputProof
        );

      // Bob submits rating: all 4s (total = 24)
      const encryptedFour = await fhevm
        .createEncryptedInput(propertyRatingContractAddress, signers.bob.address)
        .add32(4)
        .encrypt();

      await propertyRatingContract
        .connect(signers.bob)
        .submitRating(
          projectId,
          encryptedFour.handles[0], encryptedFour.inputProof,
          encryptedFour.handles[0], encryptedFour.inputProof,
          encryptedFour.handles[0], encryptedFour.inputProof,
          encryptedFour.handles[0], encryptedFour.inputProof,
          encryptedFour.handles[0], encryptedFour.inputProof,
          encryptedFour.handles[0], encryptedFour.inputProof
        );

      // Get statistics (only creator can access)
      const [totalScore, ratingCount, averageScore] = await propertyRatingContract
        .connect(signers.alice)
        .getProjectStatistics(projectId);

      // Decrypt the results
      const clearTotal = await fhevm.userDecryptEuint(
        FhevmType.euint32,
        totalScore,
        propertyRatingContractAddress,
        signers.alice
      );

      const clearCount = await fhevm.userDecryptEuint(
        FhevmType.euint32,
        ratingCount,
        propertyRatingContractAddress,
        signers.alice
      );

      expect(clearTotal).to.eq(72); // 48 + 24
      expect(clearCount).to.eq(2);
      // Average is not calculated in contract, so averageScore remains 0
    });

    it("should reject access to statistics from non-creator", async function () {
      // Submit a rating first
      const encryptedFive = await fhevm
        .createEncryptedInput(propertyRatingContractAddress, signers.bob.address)
        .add32(5)
        .encrypt();

      await propertyRatingContract
        .connect(signers.bob)
        .submitRating(
          projectId,
          encryptedFive.handles[0], encryptedFive.inputProof,
          encryptedFive.handles[0], encryptedFive.inputProof,
          encryptedFive.handles[0], encryptedFive.inputProof,
          encryptedFive.handles[0], encryptedFive.inputProof,
          encryptedFive.handles[0], encryptedFive.inputProof,
          encryptedFive.handles[0], encryptedFive.inputProof
        );

      // Bob should not be able to access statistics
      await expect(
        propertyRatingContract.connect(signers.bob).getProjectStatistics(projectId)
      ).to.be.reverted;
    });

    it("should allow user to retrieve their own ratings", async function () {
      // Submit rating
      const encryptedSeven = await fhevm
        .createEncryptedInput(propertyRatingContractAddress, signers.bob.address)
        .add32(7)
        .encrypt();

      await propertyRatingContract
        .connect(signers.bob)
        .submitRating(
          projectId,
          encryptedSeven.handles[0], encryptedSeven.inputProof,
          encryptedSeven.handles[0], encryptedSeven.inputProof,
          encryptedSeven.handles[0], encryptedSeven.inputProof,
          encryptedSeven.handles[0], encryptedSeven.inputProof,
          encryptedSeven.handles[0], encryptedSeven.inputProof,
          encryptedSeven.handles[0], encryptedSeven.inputProof
        );

      // Get user ratings - Bob should be able to access his own ratings
      const [loc, qual, amen, trans, val, pot] = await propertyRatingContract
        .connect(signers.bob)
        .getUserRating(projectId, signers.bob.address);

      // Decrypt one of them to verify
      const clearLocation = await fhevm.userDecryptEuint(
        FhevmType.euint32,
        loc,
        propertyRatingContractAddress,
        signers.bob
      );

      expect(clearLocation).to.eq(7);
    });
  });

  describe("Project Expiration", function () {
    it("should reject ratings after deadline", async function () {
      // Create project with very short duration
      const tx = await propertyRatingContract
        .connect(signers.alice)
        .createProject("Expired Project", "Description", "Location", "[]", 1); // 1 second
      await tx.wait();

      // Wait for expiration
      await ethers.provider.send("evm_increaseTime", [2]);
      await ethers.provider.send("evm_mine", []);

      // Try to submit rating
      const encryptedFive = await fhevm
        .createEncryptedInput(propertyRatingContractAddress, signers.bob.address)
        .add32(5)
        .encrypt();

      await expect(
        propertyRatingContract
          .connect(signers.bob)
          .submitRating(
            1,
            encryptedFive.handles[0], encryptedFive.inputProof,
            encryptedFive.handles[0], encryptedFive.inputProof,
            encryptedFive.handles[0], encryptedFive.inputProof,
            encryptedFive.handles[0], encryptedFive.inputProof,
            encryptedFive.handles[0], encryptedFive.inputProof,
            encryptedFive.handles[0], encryptedFive.inputProof
          )
      ).to.be.reverted;
    });
  });
});
