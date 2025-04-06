// /lib/contract.ts
import Web3 from "web3";
import ContractABI from "../../public/contract/PharmaSupplyChain.json";
import { CONTRACT_ADDRESS } from "./contractConfig";

// Load the contract
const getContract = async (web3: Web3) => {
  const networkId = await web3.eth.net.getId();
  const contract = new web3.eth.Contract(
    ContractABI.abi as any,
    CONTRACT_ADDRESS
  );
  return contract;
};

export default getContract;
