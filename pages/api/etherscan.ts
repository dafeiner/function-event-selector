export const getABI = async (address: string) => {
  if (!process.env.ETHERSCAN_API_KEY) {
    throw new Error('No Etherscan API key found');
  }

  const queryParams = {
    module: 'contract',
    action: 'getabi',
    apiKey: process.env.ETHERSCAN_API_KEY,
    address
  };

  const queryString = new URLSearchParams(queryParams).toString();
  const response = await fetch(`https://api.etherscan.io/api?${queryString}`);
  const json = await response.json();
  const abi = JSON.parse(json.result);
  return abi;
}
