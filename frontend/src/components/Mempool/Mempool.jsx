import { useState, useEffect } from "react";
import Web3 from 'web3';
import useMempoolMainnet from "./hooks/useMempoolMainnet";

const ALCHEMY_MAINNET_WSSURL = import.meta.env.VITE_ALCHEMY_MAINNET_WSSURL;

const Mempool = () => {
    // const [pendingTransactions, setPendingTransactions] = useState([]);

    // useEffect(() => {
    //     // const web3 = new Web3('wss://mainnet.infura.io/v3/2535f2daaefa46e49efd9c49a4acd9bb');
    //     const MAINNET_URL = import.meta.env.VITE_INFURA_MAINNET_WSS_URL;
    //     const web3 = new Web3.providers.WebsocketProvider(MAINNET_URL);
    //     // console.log(web3)

    //     const subscription = web3.eth.subscribe('pendingTransactions', (err, res) => {
    //         if(err) console.error(err);
    //     });

    //     subscription.on('data', (txHash) => {
    //         setPendingTransactions((prevTxs) => [...prevTxs, txHash].slice(-10)) // Keep the last 10 transactions
    //     })

    //     return() => {
    //         subscription.unsubscribe((error, success) => {
    //             if(success) {
    //                 console.log('Successfully unsubscribed!');
    //             } else {
    //                 return error
    //             }
    //         });
    //     };
    // }, []);

    const transactions = useMempoolMainnet(ALCHEMY_MAINNET_WSSURL, 100)

    console.log(transactions)

    return (
        <div>
            <h2>Ethereum Mainnet Mempool Transaction (Last10)</h2>
            <ul>
                {transactions.map((tx, index) => (
                    <li key={index}>
                        Time: {new Date().toLocaleTimeString()}, TX Hash: {tx?.hash}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Mempool;