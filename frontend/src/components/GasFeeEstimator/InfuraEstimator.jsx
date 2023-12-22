import axios from "axios";
import React, { useState } from 'react';
import useInterval from "../../hooks/useInterval";

const baseUrl = import.meta.env.VITE_INFURA_MAINNET_API_KEY;

let data = JSON.stringify({
    "jsonrpc": "2.0",
    "method": "eth_feeHistory",
    "params": [
        "0x5",
        "latest",
        []
    ],
    "id": 1
});

let config = {
    method: 'post',
    url: baseUrl,
    headers: {
        'Content-Type': 'application/json'
    },
    data: data
}

const infuraEstimator = () => {
    const [feeHistory, setFeeHistory] = useState(null);

    useInterval(() => {
        const getFeeHistory = async () => {
            const response = await axios(config);
            let history = response['data']['result'];

            // Convert base fee to Gwei
            history['baseFeePerGas'] = history['baseFeePerGas'].map(x => (parseInt(x) / 10 ** 9).toFixed(2));

            // Convert block to decimal
            history['oldestBlock'] = parseInt(history['oldestBlock']);

            // Truncate decimals of gas used and convert to percentage
            history['gasUsedRatio'] = history['gasUsedRatio'].map(x => (x * 100).toFixed(2));

            // Get block range
            let blockRange = [];
            for (let i = 0; i < 5; i++) blockRange.push(history['oldestBlock'])

            // Creating a 2D array consisting of all the information received from the API
            let formattedHistory = [
                blockRange,
                history['baseFeePerGas'].slice(0, 5),
                history['gasUsedRatio']
            ]

            // Transpose the array
            // This is done so we can populate HTML tables more easily
            const transpose = m => m[0].map((x, i) => m.map(x => x[i]))
            formattedHistory = transpose(formattedHistory);

            setFeeHistory(formattedHistory);
            console.log(formattedHistory);
        }

        getFeeHistory();
    }, 1000 * 15)

    return (
        <div className="App">
          <h1>Ethereum Gas Tracker</h1>
          {feeHistory && <table>
            <thead>
              <tr>
                <th>Block Number</th>
                <th>Base Fee (in Gwei)</th>
                <th>Gas Used</th>
              </tr>
            </thead>
            <tbody>
              {feeHistory.map(row => {
                return (
                  <tr key={row[0]}>
                    <td>{row[0]}</td>
                    <td>{row[1]}</td>
                    <td>{row[2]}%</td>
                  </tr>
                )
              })}
            </tbody>
          </table>}
        </div>
    );
};

export default infuraEstimator;