// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "./IERC20VotableToken.sol";

contract TokenizedBallot {
    uint256 public referenceBlock;
    IERC20VotableToken public tokenContract;

    struct Proposal {
        bytes32 name;
        uint256 voteCount;
    }

    Proposal[] public proposals;
    mapping(address => uint256) public votingPowerSpent;

    constructor(
        bytes32[] memory proposalNames,
        address _tokenContract,
        uint256 _referenceBlock
    ) {
        for (uint256 i = 0; i < proposalNames.length; i++) {
            proposals.push(Proposal({voteCount: 0, name: proposalNames[i]}));
        }
        tokenContract = IERC20VotableToken(_tokenContract);
        referenceBlock = _referenceBlock;
    }

    function vote(uint256 proposal, uint256 amount) public {
        uint256 _votingPower = votingPower(msg.sender);
        require(
            _votingPower >= amount,
            "TokenizedBallot: Trying to vote more than the voting power balance"
        );
        proposals[proposal].voteCount += amount;
        votingPowerSpent[msg.sender] += amount;
    }

    function votingPower(address account)
        public
        returns (uint256 votingPower_)
    {
        votingPower_ =
            tokenContract.getPastVotes(account, referenceBlock) -
            votingPowerSpent[msg.sender];
    }

    function winningProposal() public view returns (uint256 winningProposal_) {
        uint256 winningVoteCount = 0;
        for (uint256 p = 0; p < proposals.length; p++) {
            if (proposals[p].voteCount > winningVoteCount) {
                winningVoteCount = proposals[p].voteCount;
                winningProposal_ = p;
            }
        }
    }

    function winnerName() external view returns (bytes32 winnerName_) {
        winnerName_ = proposals[winningProposal()].name;
    }
}
