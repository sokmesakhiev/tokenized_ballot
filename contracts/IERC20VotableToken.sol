// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

interface IERC20VotableToken {
    function mint(address to, uint256 amount) external;

    function burn(address from, uint256 amount) external;

    function buyTokens() external payable;

    function sellTokens(uint256 _amount) external payable;
}
