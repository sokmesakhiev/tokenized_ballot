import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber, BigNumberish } from "ethers";
import { ethers } from "hardhat";
import { ERC20VotableToken } from "../typechain-types";

const RATIO = 5;
const eth = ethers.utils.parseEther("1");

describe("ERC20VotableToken Contract Test", () => {
  let erc20VotableToken: ERC20VotableToken;
  let accounts: SignerWithAddress[];
  let decimals: BigNumberish | undefined;

  beforeEach(async () => {
    const evtFactory = await ethers.getContractFactory("ERC20VotableToken");

    erc20VotableToken = (await evtFactory.deploy(RATIO)) as ERC20VotableToken;
    await erc20VotableToken.deployed();
    accounts = await ethers.getSigners();

    decimals = await erc20VotableToken.decimals();
  });

  it("should be deployed correctly", async () => {
    const totalSupply = await erc20VotableToken.totalSupply();
    expect(totalSupply).to.be.eq(0);
  });

  describe("buy and sell tokens", async () => {
    type Gases = {
      tx1Gas?: BigNumber;
      tx2Gas?: BigNumber;
    };

    let gases: Gases = {};
    let balanceBefore: BigNumber;
    let balanceAfter: BigNumber;

    beforeEach(async () => {
      balanceBefore = await accounts[0].getBalance();
      const tx1 = await erc20VotableToken.buyTokens({ value: eth });
      const { gasUsed } = await tx1.wait();
      const { gasPrice } = tx1;
      gases.tx1Gas = gasPrice?.mul(gasUsed);
      balanceAfter = await accounts[0].getBalance();
    });

    it("should able to buy tokens", async () => {
      // Fetch the tokenBalance
      const balanceOfAcc1 = await erc20VotableToken.balanceOf(
        accounts[0].address
      );
      const tokenBalanceAcc1 = ethers.utils.formatUnits(
        balanceOfAcc1,
        decimals
      );
      expect(tokenBalanceAcc1).to.be.eq("0.2");
    });

    it("should have deducted correct amount of eth", async () => {
      const ethBalance = await accounts[0].getBalance();
      const totalAfter = gases.tx1Gas?.add(eth).add(ethBalance);
      expect(totalAfter).to.be.eq(balanceBefore);
    });

    it("should able to sell tokens", async () => {
      const tx2 = await erc20VotableToken.sellToken(eth.div(RATIO));
      await tx2.wait();

      const balanceOfAcc1 = await erc20VotableToken.balanceOf(
        accounts[0].address
      );
      const tokenBalanceAcc1 = ethers.utils.formatUnits(
        balanceOfAcc1,
        decimals
      );
      expect(tokenBalanceAcc1).to.be.eq("0.0");
    });

    it("should have given back the correct amount of eth", async () => {
      const tx2 = await erc20VotableToken.sellToken(eth.div(RATIO));
      const { gasUsed } = await tx2.wait();
      const { gasPrice } = tx2;
      const tx2Gas = gasPrice?.mul(gasUsed) as BigNumber;

      const currentEthBalance = await accounts[0].getBalance();

      const totalGas = gases.tx1Gas?.add(tx2Gas) as BigNumber;

      // current = initial - gases
      const expectedBalance = balanceBefore.sub(totalGas);
      expect(currentEthBalance).to.be.eq(expectedBalance);
    });
  });

  describe("buy and sell tokens", async () => {
    type Gases = {
      tx1Gas?: BigNumber;
      tx2Gas?: BigNumber;
    };

    let gases: Gases = {};
    let balanceBefore: BigNumber;
    let balanceAfter: BigNumber;

    beforeEach(async () => {
      balanceBefore = await accounts[0].getBalance();
      const tx1 = await erc20VotableToken.buyTokens({ value: eth });
      const { gasUsed } = await tx1.wait();
      const { gasPrice } = tx1;
      gases.tx1Gas = gasPrice?.mul(gasUsed);
      balanceAfter = await accounts[0].getBalance();
    });

    it("should be 0 initally", async () => {
      const votes = await erc20VotableToken.getVotes(accounts[0].address);
      expect(votes).to.be.eq(0);
    });

    it("should be able to vote", async () => {
      const tx2 = await erc20VotableToken.delegate(accounts[0].address);
      await tx2.wait();

      const votes = await erc20VotableToken.getVotes(accounts[0].address);
      expect(votes).to.be.eq(eth.div(RATIO));
    });
  });
});
