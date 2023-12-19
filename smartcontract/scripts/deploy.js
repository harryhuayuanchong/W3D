const hre = require("hardhat");
// const { ethers } = require("hardhat");

// const API_KEY = process.env.ALCHEMY_SEPOLIA_KEY;
// const PRIVATE_KEY = process.env.PRIVATE_KEY;

// const contract = require("../artifacts/contracts/Chainlink.sol/Chainlink.json");

// provider - Alchemy
// const alchemyProvider = new ethers.AlchemyProvider("sepolia", API_KEY);

// // signer
// const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);

async function main() {
  // Payment Deployment (Completed!)
  const Payment = await hre.ethers.getContractFactory("Payment");
  const payment = await Payment.deploy();

  await payment.waitForDeployment();

  console.log("Payment deployed to: ", payment.target); // address

  // const [deployer] = await hre.ethers.getSigners();

  // console.log("Deploying contracts with the account:", deployer.address);

  // console.log("Account balance:", (await deployer.getBalance()).toString());

  // const Token = await hre.ethers.getContractFactory("Chainlink");
  // const token = await Token.deploy();

  // console.log("Token address:", token.target);
 
  // let price1 = await token.getETHUSD();
  // console.log(`Eth price is: ${price1}`);

  // let price2 = await token.getLINKUSD();
  // console.log(`Link price is: ${price2}`); 
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
