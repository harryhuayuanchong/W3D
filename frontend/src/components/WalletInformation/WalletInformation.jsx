import { Box, Divider, Flex, Heading, useColorMode } from "@chakra-ui/react";
import { useAccount } from "wagmi";

const WalletInformation = () => {
    const { isConnected } = useAccount();
    const { colorMode } = useColorMode();

    return (
        <Box>
            <Heading as="h2" fontSize={"2rem"} mb={10} className="text-shadow">
                Display Info
            </Heading>
        </Box>
    )

};

export default WalletInformation;