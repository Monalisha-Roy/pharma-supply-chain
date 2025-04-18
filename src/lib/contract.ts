// lib/contract.ts
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import contractJSON from "../../public/contract/PharmaSupplyChain.json";
import { CONTRACT_ADDRESS } from "./contractConfig";

const CONTRACT_ABI = contractJSON.abi as AbiItem[];

export const loadContract = async () => {
    if (typeof window.ethereum === "undefined") {
        alert("Please install MetaMask to continue.");
        return { web3: null, contract: null, account: null };
    }

    try {
        const web3 = new Web3(window.ethereum);
        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
        });

        const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
        return { web3, contract, account: accounts[0] };
    } catch (error) {
        console.error("Error loading contract:", error);
        alert("Failed to connect. Check MetaMask and try again.");
        return { web3: null, contract: null, account: null };
    }
};
