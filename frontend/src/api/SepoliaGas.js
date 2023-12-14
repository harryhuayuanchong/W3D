const { ethers } = require('ethers');

// 連接到 Sepolia 網絡
const provider = new ethers.providers.JsonRpcProvider(import.meta.env.VITE_INFURA_SEPOLIA_API_KEY);

async function getGasPrice() {
    const gasPrice = await provider.getGasPrice();
    return ethers.utils.formatUnits(gasPrice, 'gwei');
}
