import { ethers } from "hardhat";
import { TokenSale__factory } from "../typechain-types";

const TOKEN RATIO = 5:
const ERC20 TOKEN ADDRESS ="x3546546053454" ;

async function main() {
  const provider = ethers.getDefaultProvider("goerli");
  const wallet = ethers.Wallet.createRandom();
  const signer = wallet.connect(provider);
  const tokenSaleContractFactory = new TokenSale__factory(signer);
  const tokenSaleContract = await tokenSaleContractFactory.deploy(
    TOKEN RATIO,
    NFT_PRICE,
    ERC20 TOKEN ADDRESS,
    ERC721 TOKEN ADDRESS
  );
  await tokensaleContract.deployed();
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
