// /lib/web3.ts
import Web3 from "web3";

// Check if MetaMask is available and connect
const getWeb3 = async (): Promise<Web3 | null> => {
  if (typeof window !== "undefined" && (window as any).ethereum) {
    try {
      await (window as any).ethereum.request({ method: "eth_requestAccounts" });
      const web3 = new Web3((window as any).ethereum);
      return web3;
    } catch (error) {
      console.error("User denied account access.");
      return null;
    }
  } else {
    console.error("MetaMask not detected. Install MetaMask to use this app.");
    return null;
  }
};

export default getWeb3;
