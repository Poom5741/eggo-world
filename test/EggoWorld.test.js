const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("EggoWorld", function () {
  let eggNft, foodNft, usdt, owner, user1, user2, user3, user4, user5;
  const EGG_PRICE = ethers.parseUnits("25", 6); // 25 USDT (6 decimals)
  const MEMBERSHIP_DAYS = 30;

  beforeEach(async function () {
    [owner, user1, user2, user3, user4, user5] = await ethers.getSigners();

    // Deploy mock USDT
    const MockUSDT = await ethers.getContractFactory("MockUSDT");
    usdt = await MockUSDT.deploy();
    await usdt.waitForDeployment();

    // Deploy FoodNFT first (EggNFT needs its address)
    const FoodNFT = await ethers.getContractFactory("FoodNFT");
    foodNft = await FoodNFT.deploy();
    await foodNft.waitForDeployment();

    // Deploy EggNFT
    const EggNFT = await ethers.getContractFactory("EggNFT");
    eggNft = await EggNFT.deploy(
      await usdt.getAddress(),
      await foodNft.getAddress(),
      owner.address
    );
    await eggNft.waitForDeployment();

    // Set EggNFT as minter for FoodNFT
    await foodNft.setMinter(await eggNft.getAddress());

    // Mint USDT to users
    await usdt.mint(user1.address, ethers.parseUnits("1000", 6));
    await usdt.mint(user2.address, ethers.parseUnits("1000", 6));
    await usdt.mint(user3.address, ethers.parseUnits("1000", 6));
    await usdt.mint(user4.address, ethers.parseUnits("1000", 6));
    await usdt.mint(user5.address, ethers.parseUnits("1000", 6));
  });

  describe("EggNFT", function () {
    it("should have correct name and symbol", async function () {
      expect(await eggNft.name()).to.equal("EggoWorld Egg");
      expect(await eggNft.symbol()).to.equal("EGGOW");
    });

    it("should mint egg on payment of 25 USDT", async function () {
      await usdt.connect(user1).approve(await eggNft.getAddress(), EGG_PRICE);
      await eggNft.connect(user1).mintEgg(ethers.ZeroAddress);

      expect(await eggNft.ownerOf(1)).to.equal(user1.address);
      expect(await eggNft.totalSupply()).to.equal(1);
    });

    it("should revert if payment is wrong amount", async function () {
      const wrongAmount = ethers.parseUnits("10", 6);
      await usdt.connect(user1).approve(await eggNft.getAddress(), wrongAmount);
      await expect(
        eggNft.connect(user1).mintEgg(ethers.ZeroAddress)
      ).to.be.revertedWith("Wrong payment amount");
    });

    it("should assign rarity 1-5", async function () {
      await usdt.connect(user1).approve(await eggNft.getAddress(), EGG_PRICE);
      await eggNft.connect(user1).mintEgg(ethers.ZeroAddress);

      const rarity = await eggNft.getRarity(1);
      expect(rarity).to.be.gte(1).and.lte(5);
    });

    it("should increment token IDs", async function () {
      await usdt.connect(user1).approve(await eggNft.getAddress(), EGG_PRICE * 2n);
      await eggNft.connect(user1).mintEgg(ethers.ZeroAddress);
      await eggNft.connect(user1).mintEgg(ethers.ZeroAddress);

      expect(await eggNft.ownerOf(1)).to.equal(user1.address);
      expect(await eggNft.ownerOf(2)).to.equal(user1.address);
      expect(await eggNft.totalSupply()).to.equal(2);
    });
  });

  describe("FoodNFT", function () {
    it("should have correct name and symbol", async function () {
      expect(await foodNft.name()).to.equal("EggoWorld Food");
      expect(await foodNft.symbol()).to.equal("FOOD");
    });

    it("should mint food NFT when egg is minted", async function () {
      await usdt.connect(user1).approve(await eggNft.getAddress(), EGG_PRICE);
      await eggNft.connect(user1).mintEgg(ethers.ZeroAddress);

      expect(await foodNft.ownerOf(1)).to.equal(user1.address);
    });

    it("should only allow minter (EggNFT) to mint", async function () {
      await expect(
        foodNft.connect(user1).mintFood(user1.address)
      ).to.be.revertedWith("Only minter");
    });
  });

  describe("Membership", function () {
    it("should grant 30-day membership on mint", async function () {
      await usdt.connect(user1).approve(await eggNft.getAddress(), EGG_PRICE);
      await eggNft.connect(user1).mintEgg(ethers.ZeroAddress);

      const hasMembership = await eggNft.hasValidMembership(user1.address);
      expect(hasMembership).to.be.true;
    });

    it("should not have membership before minting", async function () {
      const hasMembership = await eggNft.hasValidMembership(user1.address);
      expect(hasMembership).to.be.false;
    });

    it("should extend membership on subsequent mints", async function () {
      await usdt.connect(user1).approve(await eggNft.getAddress(), EGG_PRICE * 2n);
      await eggNft.connect(user1).mintEgg(ethers.ZeroAddress);

      const expiry1 = await eggNft.membershipExpiry(user1.address);
      await eggNft.connect(user1).mintEgg(ethers.ZeroAddress);
      const expiry2 = await eggNft.membershipExpiry(user1.address);

      expect(expiry2).to.be.gt(expiry1);
    });
  });

  describe("Referral System", function () {
    it("should register user with referrer", async function () {
      // user1 registers with no referrer
      await usdt.connect(user1).approve(await eggNft.getAddress(), EGG_PRICE);
      await eggNft.connect(user1).mintEgg(ethers.ZeroAddress);

      // user2 registers with user1 as referrer
      await usdt.connect(user2).approve(await eggNft.getAddress(), EGG_PRICE);
      await eggNft.connect(user2).mintEgg(user1.address);

      expect(await eggNft.getReferrer(user2.address)).to.equal(user1.address);
    });

    it("should distribute 20% commission to Gen1", async function () {
      // user1 registers (no referrer)
      await usdt.connect(user1).approve(await eggNft.getAddress(), EGG_PRICE);
      await eggNft.connect(user1).mintEgg(ethers.ZeroAddress);

      // user2 registers with user1 as referrer
      const user1BalBefore = await usdt.balanceOf(user1.address);
      await usdt.connect(user2).approve(await eggNft.getAddress(), EGG_PRICE);
      await eggNft.connect(user2).mintEgg(user1.address);
      const user1BalAfter = await usdt.balanceOf(user1.address);

      // Gen1 gets 20% = 5 USDT
      expect(user1BalAfter - user1BalBefore).to.equal(ethers.parseUnits("5", 6));
    });

    it("should distribute 10% each to Gen2-4", async function () {
      // Build chain: owner <- user1 <- user2 <- user3 <- user4
      await usdt.connect(user1).approve(await eggNft.getAddress(), EGG_PRICE);
      await eggNft.connect(user1).mintEgg(ethers.ZeroAddress);

      await usdt.connect(user2).approve(await eggNft.getAddress(), EGG_PRICE);
      await eggNft.connect(user2).mintEgg(user1.address);

      await usdt.connect(user3).approve(await eggNft.getAddress(), EGG_PRICE);
      await eggNft.connect(user3).mintEgg(user2.address);

      await usdt.connect(user4).approve(await eggNft.getAddress(), EGG_PRICE);
      await eggNft.connect(user4).mintEgg(user3.address);

      // user5 buys with user4 as referrer
      // Chain: user4 (Gen1, 20%), user3 (Gen2, 10%), user2 (Gen3, 10%), user1 (Gen4, 10%)
      const u1Before = await usdt.balanceOf(user1.address);
      const u2Before = await usdt.balanceOf(user2.address);
      const u3Before = await usdt.balanceOf(user3.address);
      const u4Before = await usdt.balanceOf(user4.address);

      await usdt.connect(user5).approve(await eggNft.getAddress(), EGG_PRICE);
      await eggNft.connect(user5).mintEgg(user4.address);

      const u1After = await usdt.balanceOf(user1.address);
      const u2After = await usdt.balanceOf(user2.address);
      const u3After = await usdt.balanceOf(user3.address);
      const u4After = await usdt.balanceOf(user4.address);

      // Gen1 (user4): 20% = 5 USDT
      expect(u4After - u4Before).to.equal(ethers.parseUnits("5", 6));
      // Gen2 (user3): 10% = 2.5 USDT
      expect(u3After - u3Before).to.equal(ethers.parseUnits("2.5", 6));
      // Gen3 (user2): 10% = 2.5 USDT
      expect(u2After - u2Before).to.equal(ethers.parseUnits("2.5", 6));
      // Gen4 (user1): 10% = 2.5 USDT
      expect(u1After - u1Before).to.equal(ethers.parseUnits("2.5", 6));
    });

    it("should send remaining to project wallet when no referrer", async function () {
      const ownerBefore = await usdt.balanceOf(owner.address);
      await usdt.connect(user1).approve(await eggNft.getAddress(), EGG_PRICE);
      await eggNft.connect(user1).mintEgg(ethers.ZeroAddress);
      const ownerAfter = await usdt.balanceOf(owner.address);

      // No referrer → all 25 USDT to project
      expect(ownerAfter - ownerBefore).to.equal(EGG_PRICE);
    });

    it("should send remainder to project after commissions", async function () {
      // user1 registers (no referrer)
      await usdt.connect(user1).approve(await eggNft.getAddress(), EGG_PRICE);
      await eggNft.connect(user1).mintEgg(ethers.ZeroAddress);

      // user2 with user1 as referrer → Gen1 gets 20%, project gets 80%
      const ownerBefore = await usdt.balanceOf(owner.address);
      await usdt.connect(user2).approve(await eggNft.getAddress(), EGG_PRICE);
      await eggNft.connect(user2).mintEgg(user1.address);
      const ownerAfter = await usdt.balanceOf(owner.address);

      // Project gets 80% = 20 USDT
      expect(ownerAfter - ownerBefore).to.equal(ethers.parseUnits("20", 6));
    });

    it("should not go beyond 4 generations", async function () {
      // Build chain: user1 <- user2 <- user3 <- user4 <- user5
      await usdt.connect(user1).approve(await eggNft.getAddress(), EGG_PRICE);
      await eggNft.connect(user1).mintEgg(ethers.ZeroAddress);

      await usdt.connect(user2).approve(await eggNft.getAddress(), EGG_PRICE);
      await eggNft.connect(user2).mintEgg(user1.address);

      await usdt.connect(user3).approve(await eggNft.getAddress(), EGG_PRICE);
      await eggNft.connect(user3).mintEgg(user2.address);

      await usdt.connect(user4).approve(await eggNft.getAddress(), EGG_PRICE);
      await eggNft.connect(user4).mintEgg(user3.address);

      await usdt.connect(user5).approve(await eggNft.getAddress(), EGG_PRICE);
      await eggNft.connect(user5).mintEgg(user4.address);

      // Now deploy a user6 who references user5
      // user5 is Gen1 (20%), user4 Gen2 (10%), user3 Gen3 (10%), user2 Gen4 (10%)
      // user1 is Gen5 — should get NOTHING
      const [,, , , , , user6] = await ethers.getSigners();
      await usdt.mint(user6.address, ethers.parseUnits("1000", 6));

      const u1Before = await usdt.balanceOf(user1.address);
      await usdt.connect(user6).approve(await eggNft.getAddress(), EGG_PRICE);
      await eggNft.connect(user6).mintEgg(user5.address);
      const u1After = await usdt.balanceOf(user1.address);

      // user1 (Gen5) gets nothing
      expect(u1After).to.equal(u1Before);
    });
  });
});
