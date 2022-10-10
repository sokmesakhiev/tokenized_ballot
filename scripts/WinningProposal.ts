import { ethers } from "hardhat";
import {
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

  const proposal = await tokenizedBallotContract.winningProposal();
  const proposalName = await tokenizedBallotContract.winnerName();

  console.log(
    `The winning proposal ${proposal}`
  );

  console.log(
    `The winning proposal name ${ethers.utils.parseBytes32String(proposalName)}`
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
