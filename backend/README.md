# W3D - Backend Services (Node.js + Express.js)

This project is a backend service built on Node.js that interacts with blockchain networks via the Etherscan, Infura, and Alchemy APIs. It's designed to fetch gas price data, process it, and store it in a MongoDB database for front-end retrieval.

# Node.js Backend Project for Gas Price Data

This Node.js project interfaces with blockchain data sources like Etherscan and Infura to fetch gas price information, processes it, and exposes it through a RESTful API. The data is stored in a MongoDB database for easy access by front-end applications.

## Getting Started

These instructions will get your copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

What things you need to install the software and how to install them:

- Node.js
- npm (usually comes with Node.js)
- MongoDB

### Installing

A step by step series of examples that tell you how to get a development environment running:

1. Clone the repository to your local machine.
2. Install the dependencies with `npm install`.
3. Ensure MongoDB is running on your machine.
4. Set up your `.env` file with the required API keys and database URI.
5. Start the server using `npm start`.

## Implementation Steps

### Step 1: Designing API Interactions

- Make HTTP requests to Etherscan and Infura using Node.js's `https` module or `axios` library to retrieve Gas Oracle and EIP-1559 gas price data.

### Step 2: Fetching Blockchain Data with Node Providers

- Connect to Infura and Alchemy Node Providers using `web3.js` and `ethers.js`.
- Retrieve `eth_gasPrice` and `eth_feeHistory` from the blockchain using methods provided by these libraries, such as `web3.eth.getGasPrice` and `provider.getFeeHistory`.

### Step 3: Data Processing and Storage

- Develop logic to parse and process data obtained from the APIs and blockchain.
- Use a MongoDB client library suitable for Node.js, like `mongoose`, to save the processed data to a MongoDB database.

### Step 4: Designing and Implementing API Endpoints

- Design REST or RESTful APIs using the `Express.js` framework.
- Implement API endpoints to allow front-end applications to query the data stored in MongoDB.

## Usage

Once the server is running, you can access the API endpoints to fetch the gas price data.

## Project Structure

The project is organized as follows:

### `/config`

- `index.js` - Contains all the configuration settings for the project, like API keys and database connection strings. Configurations are set via environment variables for different deployment environments.

### `/src`

#### `/api`

- `index.js` - Defines all the API routes and references other API handlers.
- `gasPrices.js` - API endpoints for frontend communication, which invoke functions from the `services` directory to obtain data.

#### `/services`

- `etherscan.js` - Handles interaction with the Etherscan API.
- `infura.js` - Manages interaction with the Infura API.
- `alchemy.js` - Deals with interaction with the Alchemy API.
- `blockchain.js` - Handles direct blockchain interactions using web3.js and ethers.js.

#### `/models`

- `gasPriceModel.js` - Defines the schema for data to be stored in MongoDB.

#### `/utils`

- `logger.js` - Utility for application logging.
- `helper.js` - Contains general helper functions.

### Root Directory

- `.env` - A file for environment variables that should not be committed to version control.
- `package.json` - Defines Node project dependencies and scripts.
- `package-lock.json` - Ensures consistent installation of dependencies.
- `server.js` - The application's entry point and server startup script.

## Installation

Before running the project, make sure you have Node.js and MongoDB installed on your machine. Then, follow these steps:

1. Clone the repository to your local machine.
2. Run `npm install` to install all the required dependencies.
3. Set up the `.env` file with the necessary environment variables.
4. Execute `npm start` to start the server.

## Contribution

Contributions to this project are welcome. Please follow the standard fork-and-pull request workflow.

## License

This project is licensed under the [MIT License](LICENSE).
