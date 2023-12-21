import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers'; // 直接从 ethers 导入 WebSocketProvider
import abi from './abi.json';

const MempoolUniSwapV3 = () => {
    const [transactions, setTransactions] = useState([]);
    const [provider, setProvider] = useState(null);
    const router = "0xE592427A0AEce92De3Edee1F18E0157C05861564"; // Uniswap v3 SwapRouter

    useEffect(() => {
        const wssUrl = import.meta.VITE_QUICKNODE_WSSURL;
        const provider = new ethers.WebSocketProvider(wssUrl);
        setProvider(provider);

        const contractInterface = new ethers.utils.Interface(abi); // 使用 ethers.utils.Interface

        provider.on('pending', async (tx) => {
            const txnData = await provider.getTransaction(tx);
            if (txnData && txnData.to === router && txnData.data.includes("0x414bf389")) {
                let gas = txnData.gasPrice;
                let decoded = contractInterface.decodeFunctionData("exactInputSingle((address,address,uint24,address,uint256,uint256,uint256,uint160))", txnData.data);
                setTransactions(prevTransactions => [...prevTransactions, logTxn(decoded, gas)]);
            }
        });

        return () => {
            provider.removeAllListeners();
        };
    }, []);

    const logTxn = (data, gas) => {
        return {
            tokenIn: data.params.tokenIn,
            tokenOut: data.params.tokenOut,
            amount: data.params.amountOutMinimum.toString(),
            gasPrice: gas.toString()
        };
    };

    return (
        <div>
            {transactions.map((txn, index) => (
                <div key={index}>
                    <p>Token In: {txn.tokenIn}</p>
                    <p>Token Out: {txn.tokenOut}</p>
                    <p>Amount: {txn.amount}</p>
                    <p>Gas Price: {txn.gasPrice}</p>
                    <hr />
                </div>
            ))}
        </div>
    );
};

export default MempoolUniSwapV3;
