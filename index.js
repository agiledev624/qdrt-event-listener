const Web3 = require('web3');
const { abi } = require('./abi');
const axios = require('axios');

// AWS API gateway endpoint
const apiUrl = "https://u6twyb9558.execute-api.us-east-2.amazonaws.com/product/";
// AWS API gateway request authentication to modify DynamoDB
const apiKey = "NIxgwiBNQL6aIfkZbX3cgwtHX1K6nSU2zzI3C8U3";

const handler = async (event) => {
    try {
        const web3 = new Web3('wss://data-seed-prebsc-1-s3.binance.org:8545');

        // NFT contract address
        const contractAddress = '0xE2E9E446680a1e4a0A8c0D83EfF3cada0bD25A69';
        const contractAbi = abi;

        const contract = new web3.eth.Contract(contractAbi, contractAddress);

        // Subscrite the event to mint new NFT
        const eventName = 'Transfer';

        contract.events[eventName]()
            .on('data', (event) => {
            console.log('Received event:', event);
            // filter with from index for mint events
            if(event.returnValues.from == "0x0000000000000000000000000000000000000000") {
                const requestData = {
                    user: event.returnValues.to,
                    tokenId: event.returnValues.tokenId
                }
                axios.post(apiUrl, requestData, {
                    headers: {
                      'Authorization': `Bearer ${apiKey}`
                    }
                })
                .then(response => {
                    // Handle the response
                    console.log(response.data);
                })
                .catch(error => {
                    // Handle the error
                    console.error(error);
                });
            }            
        })
        .on('error', (err) => {
            console.error('Error:', err);
        });
    } catch (error) {
        console.log(error)
    }
  
};

handler();
