const axios = require("axios");
require("dotenv").config();

const Auth = Buffer.from(
    process.env.INFURA_API_KEY + ":" + process.env.INFURA_API_KEY_SECRET,
).toString("base64");

const chainId = 1;

(async () => {
    try {
        const { data } = await axios.get(
            `https://gas.api.infura.io/networks/${chainId}/suggestedGasFees`,
            {
                headers: {
                    Authorization: `Basic ${Auth}`,
                },
            },
        );
        console.log("Suggested gas fees:", data);
    } catch (error) {
        console.log("Server responded with:", error);
    }
})();