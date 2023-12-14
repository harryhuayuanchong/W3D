import { useState, useEffect, useMemo } from 'react';
import { ethers } from 'ethers';

const useMempoolMainnet = (url, limit) => {
  const [transactions, setTransactions] = useState([]);

  const provider = useMemo(() => new ethers.WebSocketProvider(url), [url]);

  useEffect(() => {
    let count = 0;

    const onNewTransaction = async (txHash) => {
      if (txHash && count < limit) {
        const tx = await provider.getTransaction(txHash);
        setTransactions((prevTxs) => [...prevTxs, tx].slice(-10)); // Keep the last 10 transactions
        count++;
      }
    };

    provider.on("pending", onNewTransaction);

    return () => provider.removeListener("pending", onNewTransaction);
  }, [url, limit, provider]);

  return transactions;
};

export default useMempoolMainnet;
