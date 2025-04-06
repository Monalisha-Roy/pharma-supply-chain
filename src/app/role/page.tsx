"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import PharmaSupplyChainABI from "../../../public/contract/PharmaSupplyChain.json" assert { type: "json" };
import { useRouter } from "next/navigation";
import Web3 from "web3";

// ✅ Correct RPC URL Configuration
const RPC_URL = "http://localhost:7545";
const CONTRACT_ADDRESS = "0xBfBe5F9D69CDEcb796B32d3f67A8be3DA1d91E98";

export default function Role() {
  const [account, setAccount] = useState<string | null>(null);
  const [contract, setContract] = useState<any>(null);
  const [roleRequested, setRoleRequested] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  // 🔥 Connect to MetaMask and Load Contract
  useEffect(() => {
    const loadWeb3 = async () => {
      if (typeof window !== "undefined" && (window as any).ethereum) {
        try {
          const web3 = new Web3((window as any).ethereum);
          await (window as any).ethereum.request({ method: "eth_requestAccounts" });
          const accounts = await web3.eth.getAccounts();
          setAccount(accounts[0]);

          // ✅ Load Contract
          const contractInstance = new web3.eth.Contract(
            PharmaSupplyChainABI.abi as any,
            CONTRACT_ADDRESS
          );
          setContract(contractInstance);

          // ✅ Check Connected Network
          const networkId = await web3.eth.net.getId();
          console.log("Connected to network:", networkId);
        } catch (error: any) {
          console.error("Error initializing Web3 or loading contract:", error);
          alert("Failed to connect to MetaMask. Please try again.");
        }
      } else {
        // ✅ Fallback to RPC URL if MetaMask not found
        const web3 = new Web3(new Web3.providers.HttpProvider(RPC_URL));
        console.log("Using fallback RPC URL...");
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);

        const contractInstance = new web3.eth.Contract(
          PharmaSupplyChainABI.abi as any,
          CONTRACT_ADDRESS
        );
        setContract(contractInstance);
      }
    };

    loadWeb3();
  }, []);

  // 🔥 Function to Request Role
  const requestRole = async (roleId: number) => {
    if (!contract || !account) {
      alert("Connect to MetaMask first.");
      return;
    }

    setLoading(true);
console.log(contract);
 try {
      await contract.methods.requestRole(1).send({ from: account })
      .on('receipt', function(){
        console.log('reci')
    });
      console.log(contract);
      setRoleRequested(true);
      alert("Role request submitted successfully! Awaiting approval.");
    } catch (error: any) {
      console.error("Error requesting role:", error);
      alert(`Error: ${error.message}`);
    }
    setLoading(false);
  };

  // 🔥 Redirect to Respective Dashboard
  const handleRoleSelect = async (role: string) => {
    if (!account) {
      alert("Please connect to MetaMask before proceeding.");
      return;
    }

    let roleId: number;

    switch (role) {
      case "Manufacturer":
        roleId = 1;
        break;
      case "Distributor":
        roleId = 2;
        break;
      case "HealthcareProvider":
        roleId = 3;
        break;
      case "Regulator":
        roleId = 4;
        break;
      default:
        roleId = 0;
        break;
    }
    if (contract) {
      console.log('here');
      try {
        const currentRole = parseInt(await contract.methods.userRoles(account).call());
        console.log(currentRole);
        if (currentRole === roleId) {
          router.push(`/${role.toLowerCase()}`);
        } else {
          // Request Role if Not Assigned
          await requestRole(roleId);
        }
      } catch (error: any) {
        console.error("Error fetching user role:", error);
        alert(`Error: ${error.message}`);
      }
    }
  };

  return (
    <div className="w-full h-screen flex flex-col items-center p-10 relative overflow-hidden">
      {/* 🔥 Background Image with Reduced Brightness */}
      <div className="fixed inset-0 -z-10">
        <Image
          src={"/verifyBg.jpg"}
          alt={"background image"}
          fill
          style={{ objectFit: "cover" }}
          className="brightness-40"
          priority
        />
      </div>

      {/* 🔥 Main Content */}
      <div className="flex flex-col items-center justify-center h-full space-y-6 text-black text-center pt-24">
        <div className="bg-white bg-opacity-80 p-6 rounded-lg shadow-lg flex flex-col items-center space-y-4 w-full max-w-md text-center">
          <h1 className="text-4xl font-bold">Select Your Role</h1>
          <p className="text-lg max-w-2xl">Choose your industry role to proceed with authentication.</p>

          {account ? (
            <p className="text-green-600 font-semibold">Connected Account: {account}</p>
          ) : (
            <p className="text-red-500">Please connect MetaMask to continue.</p>
          )}

          {/* 🔥 Role Selection */}
          <div className="flex flex-col space-y-4 w-full">
            <button
              onClick={() => handleRoleSelect("Manufacturer")}
              className="p-3 bg-[#0cc0cf] text-white rounded-lg hover:bg-opacity-100 hover:scale-105 transition transform shadow-lg w-full"
            >
              Manufacturer
            </button>
            <button
              onClick={() => handleRoleSelect("Distributor")}
              className="p-3 bg-[#0cc0cf] text-white rounded-lg hover:bg-opacity-100 hover:scale-105 transition transform shadow-lg w-full"
            >
              Distributor
            </button>
            <button
              onClick={() => handleRoleSelect("HealthcareProvider")}
              className="p-3 bg-[#0cc0cf] text-white rounded-lg hover:bg-opacity-100 hover:scale-105 transition transform shadow-lg w-full"
            >
              Healthcare Provider
            </button>
            <button
              onClick={() => handleRoleSelect("Regulator")}
              className="p-3 bg-[#0cc0cf] text-white rounded-lg hover:bg-opacity-100 hover:scale-105 transition transform shadow-lg w-full"
            >
              Regulator
            </button>
          </div>

          {/* 🔥 Loading State */}
          {loading && <p className="text-blue-500 font-semibold mt-4">Processing...</p>}

          {/* 🔥 Role Requested Confirmation */}
          {roleRequested && <p className="text-green-500 mt-4">Role request is pending approval.</p>}
        </div>
      </div>
    </div>
  );
}
