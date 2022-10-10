const { ethers } = require("hardhat");

const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3"];
const bytes32Array = PROPOSALS.map((prop) =>
  ethers.utils.formatBytes32String(prop)
);

const ERC20TOKEN = process.env.ERC20TOKEN;

const REFERENCE_BLOCK = process.env.REFERENCE_BLOCK;

module.exports = [
    bytes32Array,
    ERC20TOKEN,
    REFERENCE_BLOCK
]