import { ethers } from "hardhat";
import { ERC20VotableToken__factory } from "../typechain-types";

const TOKEN_RATIO = 5;
const ERC20_TOKEN_ADDRESS ="0xe1020E4F69B88bA828D855bA12a84B5220D82fe7" ;

async function main() {
  const provider = ethers.getDefaultProvider("goerli");
  const wallet = ethers.Wallet.createRandom();
  const signer = wallet.connect(provider);
  const erc20VotableTokenContractFactory = new ERC20VotableToken__factory(signer);
  const erc20VotableTokenContract = await erc20VotableTokenContractFactory.deploy(
    TOKEN_RATIO,
    ERC20_TOKEN_ADDRESS
  );
  await tokensaleContract.deployed();
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

