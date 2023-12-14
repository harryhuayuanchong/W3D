// SPDX-License-Indentifier: UNLICENSED
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract Chainlink {
    AggregatorV3Interface internal eth_usd_price_feed;
    AggregatorV3Interface internal link_usd_price_feed;

    /**
     * Network: Sepolia
     * Aggregator: ETH/USD
     * Address: 0x694AA1769357215DE4FAC081bf1f309aDC325306
     * Aggregator: LINK/USD
     * Address: 0xc59E3633BAAC79493d908e63626716e204A45EdF
     */
    constructor() {
        eth_usd_price_feed = AggregatorV3Interface(
            0x694AA1769357215DE4FAC081bf1f309aDC325306
        );
        link_usd_price_feed = AggregatorV3Interface(
            0xc59E3633BAAC79493d908e63626716e204A45EdF
        );
    }

    /**
     * Returns the latest price
     */
    function getETHUSD() public view returns (int) {
        (, int price,,,) = eth_usd_price_feed.latestRoundData();
        return price;
    }


    function getLINKUSD() public view returns (int) {
        (, int price,,,) = link_usd_price_feed.latestRoundData();
        return price;
    }

}

