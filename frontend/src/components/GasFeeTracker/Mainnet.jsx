import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Box,
    Flex,
    Text,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    StatGroup,
    useColorModeValue,
    VStack,
    HStack,
    useBoolean,
    Spinner,
    CircularProgress,
    CircularProgressLabel,
} from "@chakra-ui/react";
import { InfoIcon } from "@chakra-ui/icons";

const MainnetTracker = () => {
    const [gasPrices, setGasPrices] = useState({
        safeGasPrice: '',
        proposeGasPrice: '',
        fastGasPrice: '',
    });
    const [isLoading, setIsLoading] = useState(true);
    const [timer,setTimer] = useState(10);
    const [flag, setFlag] = useBoolean()

    /** 
     *  Post EIP-1559  changes :
        Safe/Proposed/Fast gas price recommendations are now modeled as Priority Fees.
        New field suggestBaseFee , the baseFee of the next pending block
        New field gasUsedRatio, to estimate how busy the network is
    */
        useEffect(() => {
            const apiKey = import.meta.env.VITE_ETHERSCAN_API_KEY;
            const url = `https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${apiKey}`;
          
            // Function to fetch gas prices
            const fetchGasPrices = () => {
              setIsLoading(true); // Start loading
              axios.get(url)
                .then(response => {
                  if (response.data.status === "1") {
                    setGasPrices({
                      safeGasPrice: response.data.result.SafeGasPrice,
                      proposeGasPrice: response.data.result.ProposeGasPrice,
                      fastGasPrice: response.data.result.FastGasPrice,
                      // ...other properties
                    });
                  }
                })
                .catch(error => {
                  console.error('Error fetching gas prices: ', error);
                })
                .finally(() => {
                  setIsLoading(false); // Finish loading
                });
            };
          
            // Initial fetch
            fetchGasPrices();
          
            // Set up interval for fetching gas prices every 10 seconds
            const intervalId = setInterval(fetchGasPrices, 10000); // 10000 milliseconds = 10 seconds

            const countdown = setInterval(() => {
                setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 10));
            }, 1000);
          
            // Clear interval on component unmount
            return () => {
                clearInterval(intervalId);
                clearInterval(countdown);
            }
        }, []);          

    const allPricesLoaded = gasPrices.safeGasPrice && gasPrices.proposeGasPrice && gasPrices.fastGasPrice;
    const bgColor = useColorModeValue('gray.50', 'gray.700');

    // return (
    //     <div>
    //         <h2>Ethereum Gas Prices</h2>
    //         <p>Safe Gas Price: {gasPrices.safeGasPrice} Gwei</p>
    //         <p>Proposed Gas Price: {gasPrices.proposeGasPrice} Gwei</p>
    //         <p>Fast Gas Price: {gasPrices.fastGasPrice} Gwei</p>
    //         <p>Last Block: {gasPrices.lastBlock} Gwei</p>
    //         <p>suggestBaseFee: {gasPrices.suggestBaseFee} Gwei</p>
    //         <p>GasUsedRatio: {gasPrices.gasUsedRatio} Gwei</p>
    //     </div>
    // );
    return (
        <HStack
            padding={5}
            spacing={5}
            align='stretch'
            bg={bgColor}
            borderRadius='lg'
            boxShadow='md'
        >
            <Box p={5} shadow='md' borderWidth='1px'>
                <Flex justifyContent='space-between' alignItems='center'>
                    <Text fontSize='x1' fontWeight='semibold'>
                        ETH Gas Price Last (GWEI)
                    </Text>
                    {/* <p>Boolean state: {flag.toString()}</p>
                    <button onClick={setFlag.toggle}>
                        Click me to toggle the boolean value
                    </button> */}
                </Flex>
                {/* <InfoIcon /> */}
                <Box position='relative' display='inline-flex'>
                    <CircularProgress value={timer * 10} size="50px" thickness="4px">
                        <CircularProgressLabel>{timer}</CircularProgressLabel>
                    </CircularProgress>
                </Box>
                <Text mt={4}>Real-time Latest Price | 2023-12-14 01:13:07</Text>
            </Box>

            <VStack>
                <StatGroup>
                    <>
                        <Stat>
                            <StatLabel>Fast</StatLabel>
                            {isLoading || !allPricesLoaded ? (
                                <Spinner thickness='4px' speed='0.65s' emptyColor='gray.200' color='blue.500' size='xl'/>
                            ) : (
                                <>
                                    <StatNumber>{gasPrices.fastGasPrice}</StatNumber>
                                    <StatHelpText>Priority Fee | 0.93 Max Fee | 127 15 Second | $3.95</StatHelpText>
                                </>
                            )}
                        </Stat>
                        <Stat>
                            <StatLabel>Normal</StatLabel>
                            {isLoading || !allPricesLoaded ? (
                                <Spinner thickness='4px' speed='0.65s' emptyColor='gray.200' color='blue.500' size='xl'/>
                            ) : (
                                <>
                                    <StatNumber>{gasPrices.proposeGasPrice}</StatNumber>
                                    <StatHelpText>Priority Fee | 0.85 Max Fee | 109 1 Minute | $3.12</StatHelpText>
                                </>
                            )}
                        </Stat>
                        <Stat>
                            <StatLabel>Slow</StatLabel>
                            {isLoading || !allPricesLoaded ? (
                                <Spinner thickness='4px' speed='0.65s' emptyColor='gray.200' color='blue.500' size='xl'/>
                            ) : (
                                <>
                                    <StatNumber>{gasPrices.safeGasPrice}</StatNumber>
                                    <StatHelpText>Priority Fee | 0.64 Max Fee | 100 3 Minutes | $2.88</StatHelpText>
                                </>
                            )}
                        </Stat>
                    </>
                </StatGroup>
            </VStack>
        </HStack>
    )
};

export default MainnetTracker;