const express = require("express");
const Moralis = require("moralis").default;
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = 3001;
const ABI = require("./abi.json");

app.use(cors());
app.use(express.json());

function convertArrayToObjects(arr) {
  console.log(arr);
  const dataArray = arr.map((transaction, index) => ({
    key: (arr.length + 1 - index).toString(),
    type: transaction[0],
    amount: transaction[1],
    message: transaction[2],
    address: `${transaction[3].slice(0,4)}...${transaction[3].slice(0,4)}`,
    subject: transaction[4],
  }));

  return dataArray.reverse();
};

app.get("/sepolia/getNameAndBalance", async (req, res) => {
  const { userAddress } = req.query;

  const response = await Moralis.EvmApi.utils.runContractFunction({
    chain: "11155111", // sepolia testnet chain id
    address: "0x2E7789b11B5F6fcA05dC1dc74e7dA9C41500b3d7", // Your deployed contract address
    functionName: "getMyName",
    abi: ABI,
    params: { _user: userAddress },
  });

  const jsonResponseName = response.raw;

  // getNativeBalance
  const secResponse = await Moralis.EvmApi.balance.getNativeBalance({
    chain: "11155111",
    address: userAddress
  })

  const jsonResponseBal =  (secResponse.raw.balance / 1e18).toFixed(2);

  // getTokenPrice
  const thirdResponse = await Moralis.EvmApi.token.getTokenPrice({
    address: "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0"
  });

  const jsonResponseDollars = (
    thirdResponse.raw.usdPrice * jsonResponseBal
  ).toFixed(2);

  // runContractFunction
  // const fourResponse = await Moralis.EvmApi.utils.runContractFunction({
  //   chain: "11155111",
  //   address: "0x2E7789b11B5F6fcA05dC1dc74e7dA9C41500b3d7",
  //   functionName: "getMyHistory",
  //   abi: ABI,
  //   params: { _user: userAddress },
  // });

  // console.log(fourResponse);

  // const jsonResponseHistory = convertArrayToObjects(fourResponse)

  const fiveResponse = await Moralis.EvmApi.utils.runContractFunction({
    chain: "11155111",
    address: "0x2E7789b11B5F6fcA05dC1dc74e7dA9C41500b3d7",
    functionName: "getMyRequests",
    abi: ABI,
    params: { _user: userAddress },
  });

  const jsonResponseRequests = fiveResponse.raw;

  const jsonResponse = {
    name: jsonResponseName,
    balance: jsonResponseBal,
    dollars: jsonResponseDollars,
    // history: jsonResponseHistory,
    requests: jsonResponseRequests,
  }

  return res.status(200).json(jsonResponse);
});

Moralis.start({
  apiKey: process.env.MORALIS_KEY,
}).then(() => {
  app.listen(port, () => {
    console.log(`Listening for API Calls`);
  });
});
