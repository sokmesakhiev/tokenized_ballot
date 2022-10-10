import { ethers } from "hardhat";
import { ERC20VotableToken__factory } from "../typechain-types";

// Default Ratio for EVT: 5ETH = 1EVT
const TOKEN_RATIO = 5;

async function main() {
  const key = process.env.PRIVATE_KEY;
  console.log({ key: `0x${key}` });
  if (!key) {
    console.log("NO PRIVATE KEY FOUND!!");
    return;
  }
  const wallet = new ethers.Wallet(ethers.utils.hexlify(`0x${key}`));
  const signer = wallet.connect(ethers.provider);

  const erc20VotableTokenContractFactory = new ERC20VotableToken__factory(
    signer
  );
  const erc20VotableTokenContract = await erc20VotableTokenContractFactory.deploy(TOKEN_RATIO);
  await erc20VotableTokenContract.deployed();

  console.log(
    `MyToken contract was deployed at address ${erc20VotableTokenContract.address}`
  );

  const initialVotes = await erc20VotableTokenContract.getVotes(signer.address);
  console.log(
    `At deployment ${signer.address} has a voting power of ${initialVotes} vote\n`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
