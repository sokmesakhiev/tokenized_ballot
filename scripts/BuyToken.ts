import { ethers } from "hardhat";
import { ERC20VotableToken__factory } from "../typechain-types";

async function main() {
  const key = process.env.PRIVATE_KEY;
  const ERC20_TOKEN_ADDRESS = process.env.ERC20TOKEN;

  console.log({ key: `0x${key}` });
  if (!key) {
    console.log("NO PRIVATE KEY FOUND!!");
    return;
  }

  if (!ERC20_TOKEN_ADDRESS) {
    console.error("ERC20 TOKEN ADDRESS NOT SET IN ENV.");
  }

  const wallet = new ethers.Wallet(ethers.utils.hexlify(`0x${key}`));
  const signer = wallet.connect(ethers.provider);

  //  Buy Token from the Contract
  const erc20VotableTokenContractFactory = new ERC20VotableToken__factory(
    signer
  );

  const erc20VotableToken = erc20VotableTokenContractFactory.attach(
    ERC20_TOKEN_ADDRESS || ""
  );

  const tx1 = await erc20VotableToken.buyTokens({
    value: ethers.utils.parseEther("0.001"),
  });
  await tx1.wait();

  // Activate Vote
  const tx2 = await erc20VotableToken.delegate(signer.address);
  await tx2.wait();

  console.log(
    "Successfully Bought Tokens for 0.001 ETH and Delegated Votes to self."
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
