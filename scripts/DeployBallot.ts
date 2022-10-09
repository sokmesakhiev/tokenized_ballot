import { ethers } from "hardhat";
import { TokenizedBallot__factory } from "../typechain-types";

async function main() {
  const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3"];
  const bytes32Array = PROPOSALS.map( prop => ethers.utils.formatBytes32String(prop))
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const tokenizedBallotFactory = await ethers.getContractFactory("");
  const wallet = ethers.Wallet.createRandom();
  const provider = ethers.getDefaultProvider("goerli");
  const signer = wallet.connect(provider);
  const tokenizedBallotFactory = new ERC20VotableToken__factory(signer);
  const tokenizedBallotContract = await ballotFactory.deploy(bytes32Array);
  await ballotContract.deployed();

  console.log("TokenizedBallot Contract address:", ballotContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
