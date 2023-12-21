const Web3 = require('web3');

/**
 * web3.js - getFeeHistory
 * 
 * Parameters:
 * web3Context, blockCount, newestBlock, rewardPercentiles, returnFormat
 * Returns:
    * Promise<{ baseFeePerGas: NumberTypes[ReturnFormat[number]];
    * gasUsedRatio: NumberTypes[ReturnFormat[number]][];
    * oldestBlock: NumberTypes[ReturnFormat[number]];
    * reward: NumberTypes[ReturnFormat[number]][][] }>
 *
 */

const ALCHEMY_MAINNET_API_KEY='';

const web3 = new Web3(ALCHEMY_MAINNET_API_KEY)

// const historicalBlocks = 4;
// web3.eth.getFeeHistory(historicalBlocks, "pending", [25, 50, 75]).then(console.log);
web3.eth.getGasPrice().then(console.log);