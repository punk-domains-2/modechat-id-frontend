import { ethers } from 'ethers';

export default function useChainHelpers() {

  function getChainName(chainId) {
    if (chainId === 1) {
      return "Ethereum";
    } else if (chainId === 919) {
      return "Mode Testnet";
    } else if (chainId === 34443) {
      return "Mode Mainnet";
    } else {
      return "Unsupported Network";
    }
  }

  function getFallbackProvider(networkId) {
    let urls;

      if (networkId === 1) {
        // Ethereum
        urls = [
          "https://1rpc.io/eth"
        ];
      } else if (networkId === 919) {
        // Mode Testnet
        urls = [
          "https://sepolia.mode.network/"
        ]; 
      } else if (networkId === 34443) {
        // Mode Mainnet
        urls = [
          "https://mainnet.mode.network/"
        ]; 
      } 

      if (urls) {
        const providers = urls.map(url => new ethers.providers.JsonRpcProvider(url));
        return new ethers.providers.FallbackProvider(providers, 1); // return fallback provider
      } else {
        return null;
      }
  }

  function switchNetwork(networkName) {
    let method;
    let params;

    if (networkName == "Ethereum") {
      method = "wallet_switchEthereumChain"
      params = [{ chainId: "0x1" }] 
    } else if (networkName == "Mode Testnet") {
      method = "wallet_addEthereumChain"
      params = [{ 
        blockExplorerUrls: [ "https://sepolia.explorer.mode.network/" ],
        chainId: ethers.utils.hexValue(919),
        chainName: networkName,
        nativeCurrency: { decimals: 18, name: "ETH", symbol: "ETH" }, 
        rpcUrls: ["https://sepolia.mode.network"]
      }] 
    } else if (networkName == "Mode Mainnet") {
      method = "wallet_addEthereumChain"
      params = [{ 
        blockExplorerUrls: [ "https://explorer.mode.network/" ],
        chainId: ethers.utils.hexValue(34443),
        chainName: networkName,
        nativeCurrency: { decimals: 18, name: "ETH", symbol: "ETH" }, 
        rpcUrls: ["https://mainnet.mode.network"]
      }] 
    } 

    return { 
      method: method, 
      params: params
    }
  }

  // RETURN
  return {
    getChainName,
    getFallbackProvider,
    switchNetwork
  }
}