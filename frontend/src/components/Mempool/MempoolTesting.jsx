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
        newProvider.on("pending", throttle(async(txHash) => {
            if (txHash && i < 100) {
                setPendingTransactions(prevTxs => [...prevTxs, txHash]);
                i++;
            }
        }, 1000));

        // 组件卸载时关闭provider连接
        return () => {
            newProvider.removeAllListeners();
            newProvider.destroy();
        };
    }, []);

    // Rendering
    return (
        <div>
            <h2>Pending Transactions:</h2>
            {pendingTransactions.map((txHash, index) => (
                <div key={index}>{txHash}</div>
            ))}
        </div>
    );
};

export default MempoolMonitor;
