# Weekend Project 3: Tokenized Ballot

## Development

```bash
yarn install
yarn hardhat compile
```

Then create a file named `.env` with the following content and fill values:

```env
PRIVATE_KEY=
API_URL=
ERC20TOKEN=0xdA14A29F58f7417583930Fd6BeDA5c8E6B5C31bF
REFERENCE_BLOCK=7741766
TOKENIZED_BALLOT=0x66F598b85c38DaEC1fFEB052025a7D88E8A7d9FE
```

---

## Scripts

```sh
yarn hardhat run ./scripts/DeployERC20VotableToken.ts --network goerli
```

this gave me my erc20 token address: 0x4ddcaA650bb134dA099eD7e62C5AAb33e354b96D , set this is .env file with ERC20TOKEN key.

Next:
**Buy Token on our contract script**

```sh
yarn hardhat run ./scripts/BuyToken.ts --network goerli
```

Now we will have some token and votes for the same.

Next:
**Deploying TokenizedBallot**

```sh
yarn hardhat run ./scripts/DeployBallot.ts --network goerli
```

In the output you will get a number, that is the reference block number: `7741878`
Set the reference block number in the `.env` file with key `REFERENCE_BLOCK=7741878`
And also set Tokenized Ballot Contract Address as:

```env
TOKENIZED_BALLOT=0xFaA8c2b553C62172df121708370a3F189450351B (You will find it in the console logs)
```

Next:
**Check your votes**

```sh
yarn hardhat run ./scripts/GetVotes.ts --network goerli
```

Next:
**Check your votes**

Next: **Delegate**
This is optional, you can delegate to any account. Please change `delegatee` variable in the `scripts/DelegateVotes.ts`.

```sh
yarn hardhat run ./scripts/DelegateVotes.ts --network goerli
```

Expected Output:

You have successfully delegated to `0xD9aF6C670B49C4b1239B86bb472E877f5BdF13Bf`, on txn `0x15b3c7408ffcbb0f5fe5dbe98173d5ddeecaf6eb46c246dac43476356ad87346`
My Delegatee:
`0xD9aF6C670B49C4b1239B86bb472E877f5BdF13Bf`

Next:
Now **we have votes**
We will vote now, by default it is set to 0 in GiveVote.ts script with variable name proposal_to_give_vote. Change it if you want to give vote to some other address

```sh
yarn hardhat run ./scripts/GiveVote.ts --network goerli
```

Expected Output:

You have successfully voted on proposal 0, on txn `0xf0afdec04ff4731b4ed9c295165638d1242a9e62b3329b91f4de7259ec42b295`
My Voted Stats:

`BigNumber { value: "200000000000000" }`
