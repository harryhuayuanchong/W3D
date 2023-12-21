import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import {
    Button,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
  } from '@chakra-ui/react'

function throttle(fn, delay) {
    let timer;

    return function() {
        if (!timer) {
            fn.apply(this, arguments);
            timer = setTimeout(() => {
                clearTimeout(timer);
                timer = null;
            }, delay);
        }
    }
}

const ALCHEMY_MAINNET_WSSURL = 'wss://eth-mainnet.g.alchemy.com/v2/-tKlq4BWG6ebI9Mq-bLslOeKz5LtjVKw';

const MempoolMonitor = () => {
    const [pendingTransactions, setPendingTransactions] = useState([]);
    const [provider, setProvider] = useState(null);

    useEffect(() => {
        // Create provider
        const newProvider = new ethers.WebSocketProvider(ALCHEMY_MAINNET_WSSURL);
        setProvider(newProvider);

        // Monitoring the pending transactions
        let i = 0;
        newProvider.on("pending", throttle(async(tx) => {
            if (tx && i < 100) {
                setPendingTransactions(prevTxs => [...prevTxs, tx]);
                i++;
            }
        }, 1000));

        // 组件卸载时关闭provider连接
        return () => {
            newProvider.removeAllListeners();
            newProvider.destroy();
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

    // Rendering
    return (
        <div>
            <h2>Pending Transactions:</h2>
            {pendingTransactions.map((tx, index) => (
                <div key={index}>
                    <p>Token In: {tx.tokenIn}</p>
                    <p>Token Out: {tx.tokenOut}</p>
                    <p>Amount: {tx.amount}</p>
                    <p>Gas Price: {tx.gasPrice}</p>
                    <hr />
                </div>
            ))}
        </div>
    );
};

export default MempoolMonitor;
