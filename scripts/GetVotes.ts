import { ethers } from "hardhat";
import { ERC20VotableToken__factory } from "../typechain-types";

async function main() {
  const key = process.env.PRIVATE_KEY;
  const ERC20_TOKEN_ADDRESS = process.env.ERC20TOKEN;
  const REFERENCE_BLOCK = process.env.REFERENCE_BLOCK;

  console.log({ key: `0x${key}` });
  if (!key) {
    console.log("NO PRIVATE KEY FOUND!!");
    return;
  }

  if (!ERC20_TOKEN_ADDRESS) {
    console.error("ERC20 TOKEN ADDRESS NOT SET IN ENV.");
    return;
  }

  if (!REFERENCE_BLOCK) {
    console.error("REFERENCE BLOCK is not set in .env");
    return;
  }

  const wallet = new ethers.Wallet(ethers.utils.hexlify(`0x${key}`));
  const signer = wallet.connect(ethers.provider);

  //  get votes from the Contract
  const erc20VotableTokenContractFactory = new ERC20VotableToken__factory(
    signer
  );

  const erc20VotableToken = erc20VotableTokenContractFactory.attach(
    ERC20_TOKEN_ADDRESS || ""
  );

  const votes = await erc20VotableToken.getPastVotes(
    signer.address,
    REFERENCE_BLOCK
  );
  console.log(
    `Votes for Address ${signer.address} at Reference Block ${REFERENCE_BLOCK} are ${votes}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
