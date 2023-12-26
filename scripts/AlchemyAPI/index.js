// index.js
const { Network, Alchemy } = require('alchemy-sdk');
const { parseEther } = require("ethers/lib/utils");
require("dotenv").config();

const settings = {
    apiKey: process.env.ALCHEMY_API_KEY,
    network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

// Get the latest block
const latestBlock = alchemy.core.getBlockNumber();

console.log(latestBlock);

alchemy.core
    .estimateGas({
      // Wrapped ETH address
      to: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      // `function deposit() payable`
      data: "0xd0e30db0",
      // 1 ether
      value: parseEther("1.0"),
    })
    .then(console.log);

// Get all the NFTs owned by an address
// const nfts = alchemy.nft.getNftsForOwner("vitalik.eth");

// Listen to all new pending transactions
// alchemy.ws.on(
//     { method: "alchemy_pendingTransactions",
//     fromAddress: "vitalik.eth" },
//     (res) => console.log(res)
// );