import { useState } from 'react';
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

const MempoolMonitor = () => {
    const [transactions, setTransactions] = useState([]);
    const ALCHEMY_MAINNET_WSSURL = import.meta.env.VITE_ALCHEMY_MAINNET_WSSURL;

    // Monitoring Mempool
    const listenToMempool = () => {
        try {
            const provider = new ethers.WebSocketProvider(ALCHEMY_MAINNET_WSSURL);

            console.log(provider)
            let count = 0;
            provider.on("pending", throttle(async (txHash) => {
                if (txHash) {
                    let tx = await provider.getTransaction(txHash);
                    setTransactions(prev => [...prev, tx]);
                    count++;
                    if (count >= 100) {
                        provider.removeAllListeners("pending");
                    }
                }
            }, 1000));
        } catch (e) {
            console.error("Error creating WebSocketProvider: ", e);
        }
        
    };

    return (
        <div>
            <Button onClick={listenToMempool}>Monitoring Mempool Pending Transactions</Button>
            <Table>
                <Thead>
                    <Tr>
                        <Th>Time</Th>
                        <Th>Hash</Th>
                        <Th>From</Th>
                        <Th>To</Th>
                        <Th>Gas Fee</Th>
                        <Th>ETH Amount</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {transactions.map((tx, index) =>{
                        <Tr key={index}>
                            <Td>{(new Date()).toLocaleTimeString()}</Td>
                            <Td>{tx?.hash}</Td>
                            <Td>{tx?.from}</Td>
                            <Td>{tx?.to}</Td>
                            <Td>{tx?.gasPrice?.toString()}</Td>
                            <Td>{tx?.value?.toString()}</Td>
                        </Tr>
                    })}
                </Tbody>
            </Table>
        </div>
    );
};

export default MempoolMonitor;