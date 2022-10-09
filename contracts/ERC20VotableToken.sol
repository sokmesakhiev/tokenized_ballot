// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IMyERC20Token is IERC20 {
    function mint(address to, uint256 amount) external;

    function burnFrom(address from, uint256 amount) external;
}

contract ERC20VotableToken is Ownable {
    uint256 public ratio;
    uint256 public price;
    IMyERC20Token public paymentToken;
    uint256 public ownerPool;

    constructor(
        uint256 _ratio,
        address _paymentToken
    ) {
        ratio = _ratio;
        paymentToken = IMyERC20Token(_paymentToken);
    }

    function buyTokens() public payable {
        uint256 paymentReceived = msg.value;
        uint256 amountToBeGiven = paymentReceived / ratio;
        paymentToken.mint(msg.sender, amountToBeGiven);
    }

    function burnTokens(uint256 amount) public {
        paymentToken.burnFrom(msg.sender, amount);
        uint256 amountToBeReturned = amount * ratio;
        payable(msg.sender).transfer(amountToBeReturned);
    }

    function withdraw(uint256 amount) public onlyOwner {
        require(amount <= ownerPool);
        ownerPool -= amount;
        paymentToken.transfer(msg.sender, amount);
    }
}
