import React, { useState, useEffect } from "react";
import axios from "axios";

const MainnetTracker = () => {
    const [gasPrices, setGasPrices] = useState({
        safeGasPrice: '',
        proposeGasPrice: '',
        fastGasPrice: '',
    });

    useEffect(() => {
        const apiKey = import.meta.env.VITE_ETHERSCAN_API_KEY;
        const url = `https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${apiKey}`;

        axios.get(url)
            .then(response => {
                if(response.data.status === "1") {
                    setGasPrices({
                        safeGasPrice: response.data.result.SafeGasPrice,
                        proposeGasPrice: response.data.result.ProposeGasPrice,
                        fastGasPrice: response.data.result.FastGasPrice,
                        lastBlock: response.data.result.LastBlock,
                        suggestBaseFee: response.data.result.suggestBaseFee,
                        gasUsedRatio: response.data.result.gasUsedRatio,
                    });
                }
            })
            .catch(error => {
                console.error('Error fetching gas prices: ', error);
            });
    }, []);

    return (
        <div>
            <h2>Ethereum Gas Prices</h2>
            <p>Safe Gas Price: {gasPrices.safeGasPrice} Gwei</p>
            <p>Proposed Gas Price: {gasPrices.proposeGasPrice} Gwei</p>
            <p>Fast Gas Price: {gasPrices.fastGasPrice} Gwei</p>
            <p>Last Block: {gasPrices.lastBlock} Gwei</p>
            <p>suggestBaseFee: {gasPrices.suggestBaseFee} Gwei</p>
            <p>GasUsedRatio: {gasPrices.gasUsedRatio} Gwei</p>
        </div>
    );
};

export default MainnetTracker;