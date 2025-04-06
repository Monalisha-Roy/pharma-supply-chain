"use client";

import { useState, useEffect } from "react";
import getWeb3 from "@/lib/web3";
import getContract from "@/lib/contract";

export default function Home() {
  const [account, setAccount] = useState<string | null>(null);
  const [contract, setContract] = useState<any>(null);
  const [batchDetails, setBatchDetails] = useState<any>(null);

  // Connect to MetaMask and Load Contract
  useEffect(() => {
    const init = async () => {
      const web3 = await getWeb3();
      if (web3) {
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);

        const contractInstance = await getContract(web3);
        setContract(contractInstance);
      }
    };

    init();
  }, []);

  // Fetch Batch Details
  const getBatchDetails = async (batchId: number) => {
    if (contract) {
      const details = await contract.methods.getBatch(batchId).call();
      setBatchDetails(details);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-6">Pharma Supply Chain</h1>
      {account ? (
        <p className="text-lg">Connected Account: {account}</p>
      ) : (
        <p className="text-red-500">Connect MetaMask to continue</p>
      )}

      {/* Get Batch Details Button */}
      <div className="mt-4">
        <button
          onClick={() => getBatchDetails(1)}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
        >
          Get Batch Details
        </button>
      </div>

      {/* Display Batch Details */}
      {batchDetails && (
        <div className="mt-6 text-center">
          <h2 className="text-2xl font-semibold">Batch Details:</h2>
          <p>Drug Name: {batchDetails[0]}</p>
          <p>Quantity: {batchDetails[1]}</p>
          <p>Manufacturer: {batchDetails[2]}</p>
        </div>
      )}
    </div>
  );
}
