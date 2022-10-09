import { ethers } from "hardhat";
import {
  ERC20VotableToken__factory,
  TokenizedBallot__factory,
} from "../typechain-types";

async function main() {
  const proposal_to_give_vote = 0;

  const key = process.env.PRIVATE_KEY;
  console.log({ key: `0x${key}` });
  if (!key) {
    console.log("NO PRIVATE KEY FOUND!!");
    return;
  }

  const ERC20_TOKEN_ADDRESS = process.env.ERC20TOKEN;
  const REFERENCE_BLOCK = process.env.REFERENCE_BLOCK;

  if (!ERC20_TOKEN_ADDRESS) {
    console.error("ERC20 TOKEN ADDRESS NOT SET IN ENV.");
    return;
  }

  if (!REFERENCE_BLOCK) {
    console.error("REFERENCE BLOCK is not set in .env");
    return;
  }

  const TOKENIZED_BALLOT = process.env.TOKENIZED_BALLOT;

  if (!TOKENIZED_BALLOT) {
    console.error("TOKENIZED_BALLOT not set in env");
    return;
  }

  const wallet = new ethers.Wallet(ethers.utils.hexlify(`0x${key}`));
  const signer = wallet.connect(ethers.provider);

  const tokenizedBallotFactory = new TokenizedBallot__factory(signer);
  const tokenizedBallotContract =
    tokenizedBallotFactory.attach(TOKENIZED_BALLOT);

  //  get votes from the Contract
  const erc20VotableTokenContractFactory = new ERC20VotableToken__factory(
    signer
  );

  const erc20VotableToken = erc20VotableTokenContractFactory.attach(
    ERC20_TOKEN_ADDRESS || ""
  );

  const votesBalance = await erc20VotableToken.getPastVotes(
    signer.address,
    REFERENCE_BLOCK
  );

  const tx1 = await tokenizedBallotContract.vote(0, votesBalance);
  await tx1.wait();

  console.log(
    `You have successfully voted on proposal ${proposal_to_give_vote}, on txn ${tx1.hash}`
  );

  const myVoted = await tokenizedBallotContract.votingPowerSpent(
    signer.address
  );
  console.log("My Voted Stats: \n");
  console.log(myVoted);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
