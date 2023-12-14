import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

function GasFeeTracker() {
    const [gasPrice, setGasPrice] = useState('');

    useEffect(() => {
        const provider = new ethers.JsonRpcProvider(import.meta.env.VITE_INFURA_SEPOLIA_API_KEY);
        
        async function fetchGasPrice() {
            try {
                const feeData = await provider.getFeeData();
                console.log(feeData)
                if (feeData && feeData.gasPrice) {
                    const priceFormatted = ethers.utils.formatUnits(feeData.gasPrice, 'gwei');
                    setGasPrice(priceFormatted);
                }
            } catch (error) {
                console.error('Error fetching gas price:', error);
            }
        }

        fetchGasPrice();
    }, []);

    return (
        <div>
            <h1>Sepolia Gas Fee Tracker</h1>
            <p>Current Gas Price: {gasPrice} Gwei</p>
        </div>
    );
}

export default GasFeeTracker;
