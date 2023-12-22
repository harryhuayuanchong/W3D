import axios from "axios";
import React, { useState, useEffect } from "react";

const MoralisEstimator = () => {
    const [showResult, setShowResult] = useState(false);
    const [result, setResult] = useState([]);

    useEffect(() => {
        async function getGas() {
            await axios.get("http://localhost:3001/getgasprice").then((response) => {
                setResult(response.data);
                setShowResult(true);
                console.log(response);
            });
        }
        getGas();
    }, []);

    return (
        <>
            {showResult && (
                <section>
                {showResult && (
                  <section>
                    <span>
                      {
                        new Date(result.__headers.date)
                          .toLocaleString("sv-SE")
                          .split(" ")[0]
                      }
                    </span>
                    <section>
                      <section>
                        <span>DEPRIORITIZED</span>
                        {result.deprioritized_gas_estimate}
                      </section>
                      <section>
                        <span>ESTIMATED</span>
                        {result.gas_estimate}
                      </section>
                      <section>
                        <span>PRIORITIZED</span>
                        {result.prioritized_gas_estimate}
                      </section>
                    </section>
                  </section>
                )}
              </section>
            )}
        </>
    )
}

export default MoralisEstimator;