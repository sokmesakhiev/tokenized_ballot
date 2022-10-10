import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber, BigNumberish } from "ethers";
import { ethers } from "hardhat";
import { ERC20VotableToken, TokenizedBallot } from "../typechain-types";

const RATIO = 5;
const REFERENCE_BLOCK = 10;
const eth = ethers.utils.parseEther("1");
const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3"];

function convertStringArrayToBytes32(array: string[]) {
  const bytes32Array = [];
  for (let index = 0; index < array.length; index++) {
    bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
  }
  return bytes32Array;
}

function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}

describe("ERC20VotableToken Contract Test", () => {
  let erc20VotableToken: ERC20VotableToken;
  let tokenizedBallot: TokenizedBallot;
  let accounts: SignerWithAddress[];
  let decimals: BigNumberish | undefined;

  beforeEach(async () => {
    // Deploy the EVT Token Contract
    const evtFactory = await ethers.getContractFactory("ERC20VotableToken");
    erc20VotableToken = (await evtFactory.deploy(RATIO)) as ERC20VotableToken;
    await erc20VotableToken.deployed();

    // Fetch the Accounts
    accounts = await ethers.getSigners();

    // Fetch the Token Decimals
    decimals = await erc20VotableToken.decimals();

    // Deploy the Tokenized Ballot
    const tokBallotFactory = await ethers.getContractFactory("TokenizedBallot");
    tokenizedBallot = (await tokBallotFactory.deploy(
      convertStringArrayToBytes32(PROPOSALS),
      erc20VotableToken.address,
      REFERENCE_BLOCK
    )) as TokenizedBallot;
  });

  it("should be deployed correctly", async () => {
    const totalSupply = await erc20VotableToken.totalSupply();
    expect(totalSupply).to.be.eq(0);
  });

  describe("vote on a proposal", async () => {
    type Gases = {
      tx1Gas?: BigNumber;
      tx2Gas?: BigNumber;
    };

    let gases1: Gases = {};
    let balanceBeforeAcc1: BigNumber;
    let balanceBeforeAcc2: BigNumber;
    beforeEach(async () => {
      balanceBeforeAcc1 = await accounts[0].getBalance();
      const tx1 = await erc20VotableToken.buyTokens({ value: eth });
      const { gasUsed } = await tx1.wait();
      const { gasPrice } = tx1;
      gases1.tx1Gas = gasPrice?.mul(gasUsed);

      balanceBeforeAcc2 = await accounts[1].getBalance();
      const tx2 = await erc20VotableToken
        .connect(accounts[1])
        .buyTokens({ value: eth });
      const gasUsed2 = (await tx2.wait()).gasUsed;
      const gasPrice2 = tx2.gasPrice;
      gases1.tx2Gas = gasPrice2?.mul(gasUsed2);
    });

    it("should be able to vote", async () => {
      const deletageTx1 = await erc20VotableToken.delegate(accounts[0].address);
      await deletageTx1.wait();

      const deletageTx2 = await erc20VotableToken
        .connect(accounts[1])
        .delegate(accounts[1].address);
      await deletageTx2.wait();

      const dummyTx1 = await erc20VotableToken
        .connect(accounts[2])
        .buyTokens({ value: eth });
      await dummyTx1.wait();

      const dummyTx2 = await erc20VotableToken
        .connect(accounts[2])
        .buyTokens({ value: eth });
      await dummyTx2.wait();

      const dummyTx3 = await erc20VotableToken
        .connect(accounts[2])
        .buyTokens({ value: eth });
      await dummyTx3.wait();

      const currentBlock = await ethers.provider.getBlock("latest");
      console.log(currentBlock.number);

      const vote1 = await erc20VotableToken.getPastVotes(
        accounts[0].address,
        REFERENCE_BLOCK
      );
      console.log(vote1);

      const vote2 = await erc20VotableToken.getPastVotes(
        accounts[1].address,
        REFERENCE_BLOCK
      );
      console.log(vote2);

      //    Vote on a proposal

      const vote1Tx1 = await tokenizedBallot.connect(accounts[0]).vote(0, vote1);
      vote1Tx1.wait();

      const vote1AfterVoting = await erc20VotableToken.getPastVotes(
        accounts[0].address,
        (
          await ethers.provider.getBlock("latest")
        ).number -1
      );
      console.log(vote1AfterVoting);

      const proposal1Status = await tokenizedBallot.proposals(0);
      console.log(proposal1Status);

      // Try to vote with same address again
      await expect(tokenizedBallot.connect(accounts[0]).vote(0, vote1)).to.be.reverted;

      const spendVotingPower = await tokenizedBallot.votingPowerSpent(accounts[0].address);
      expect(spendVotingPower).to.be.eq(vote1);

      // Get the winner
      const winner = await tokenizedBallot.winningProposal();
      const winnerName = await tokenizedBallot.winnerName();
      expect(ethers.utils.parseBytes32String(winnerName)).to.be.eq(PROPOSALS[winner.toNumber()])
    });
  });
});
