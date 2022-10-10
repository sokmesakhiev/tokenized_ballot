import { ethers } from "hardhat";
import {
  ERC20VotableToken__factory,
  TokenizedBallot__factory,
} from "../typechain-types";

async function main() {
  const delegatee = "0xD9aF6C670B49C4b1239B86bb472E877f5BdF13Bf";

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
  console.log(signer.address);

  const erc20VotableToken = erc20VotableTokenContractFactory.attach(
    ERC20_TOKEN_ADDRESS || ""
  );

  const delegationTx = await erc20VotableToken.delegate(delegatee);
  await delegationTx.wait();

  console.log(
    `You have successfully delegated to ${delegatee}, on txn ${delegationTx.hash}`
  );

  const delegatedTo = await erc20VotableToken.delegates(signer.address);
  console.log("My Delegatee:");
  console.log(delegatedTo);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
