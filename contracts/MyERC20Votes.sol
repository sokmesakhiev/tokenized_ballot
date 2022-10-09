// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

/// @title Voting with delegation.

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
// import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

// contract MyERC20Votes is ERC20, AccessControl, ERC20Permit, ERC20Votes {
contract MyERC20Votes is ERC20, AccessControl{
  bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

  constructor() ERC20("MyToken", "MTK"){
    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _grantRole(MINTER_ROLE, msg.sender);
  }

  function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
    _mint(to, amount) ;
  }

  // function _afterTokenTransfer(address from, address to, uint256 amount) internal override(ERC20, ERC20Votes) {
  //   super.afterTokenTransfer(from, to, amount) ;
  // }
}
