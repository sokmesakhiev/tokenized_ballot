import { ethers } from "hardhat";
import { TokenizedBallot__factory } from "../typechain-types";

async function main() {

  const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3"];
  const bytes32Array = PROPOSALS.map((prop) =>
    ethers.utils.formatBytes32String(prop)
  );
  const key = process.env.PRIVATE_KEY;
  console.log({ key: `0x${key}` });
  if (!key) {
    console.log("NO PRIVATE KEY FOUND!!");
    return;
  }

  const _tokenContract = process.env.ERC20TOKEN || "";

  if (!_tokenContract) {
    console.error("ERC20 TOKEN ADDRESS NOT SET IN ENV.");
  }

  const wallet = new ethers.Wallet(ethers.utils.hexlify(`0x${key}`));
  const signer = wallet.connect(ethers.provider);

  const _referenceBlock = (await ethers.provider.getBlock("latest")).number;
  console.log(_referenceBlock);

  const tokenizedBallotFactory = new TokenizedBallot__factory(signer);
  const tokenizedBallotContract = await tokenizedBallotFactory.deploy(
    bytes32Array,
    _tokenContract,
    _referenceBlock
  );
  await tokenizedBallotContract.deployed();

  console.log(
    "TokenizedBallot Contract address:",
    tokenizedBallotContract.address
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
