"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loadContract } from "@/lib/contract";

export default function Role() {
  const [account, setAccount] = useState<string | null>(null);
  const [contract, setContract] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [roleRequested, setRoleRequested] = useState<boolean>(false);
  const [redirecting, setRedirecting] = useState<boolean>(false);

  const router = useRouter();

  // 🔥 Load contract and MetaMask connection
  useEffect(() => {
    const init = async () => {
      const { web3, contract, account } = await loadContract();
      if (web3 && contract && account) {
        setContract(contract);
        setAccount(account);

        // Check user's role and redirect if necessary
        const currentRole = parseInt(await contract.methods.userRoles(account).call());
        if (currentRole !== 0) {
          setRedirecting(true); // Show loading screen
          const roleMap: Record<number, string> = {
            1: "manufacturer",
            2: "distributor",
            3: "healthcareprovider",
            4: "regulator",
          };
          router.push(`/${roleMap[currentRole]}`);
        }
      }
    };

    init();
  }, [router]);

  // 🔥 Request Role from Contract
  const requestRole = async (roleId: number) => {
    if (!contract || !account) {
      alert("Please connect to MetaMask first.");
      return;
    }

    setLoading(true);

    try {
      await contract.methods.requestRole(roleId).send({ from: account });
      setRoleRequested(true);
      alert("Role request submitted successfully! Awaiting approval.");
    } catch (error: any) {
      console.error("Error requesting role:", error);
      if (error.code === -32603) {
        alert("Internal JSON-RPC error. Please check your contract or RPC provider.");
      } else if (error.message.includes("insufficient funds")) {
        alert("Insufficient funds in your wallet.");
      } else {
        alert(`Transaction error: ${error.message}`);
      }
    }

    setLoading(false);
  };

  // 🔥 Role Handler + Dashboard Redirect
  const handleRoleSelect = async (role: string) => {
    if (!contract || !account) {
      alert("Please connect to MetaMask.");
      return;
    }

    const roleMap: Record<string, number> = {
      Manufacturer: 1,
      Distributor: 2,
      HealthcareProvider: 3,
      Regulator: 4,
    };

    const roleId = roleMap[role] || 0;

    try {
      const currentRole = parseInt(await contract.methods.userRoles(account).call());
      if (currentRole === roleId) {
        setRedirecting(true); // Show loading screen
        router.push(`/${role.toLowerCase()}`);
      } else {
        await requestRole(roleId);
      }
    } catch (error: any) {
      console.error("Error fetching user role:", error);
      if (error.code === -32603) {
        alert("RPC error while fetching role.");
      } else {
        alert(`Error: ${error.message}`);
      }
    }
  };

  if (redirecting) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center">
          <p className="text-xl font-semibold text-blue-500 mb-4">Redirecting to your dashboard...</p>
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex flex-col items-center p-10 relative overflow-hidden">
      {/* 🔥 Background Image */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/verifyBg.jpg"
          alt="background"
          fill
          className="brightness-40 object-cover"
          priority
        />
      </div>

      {/* 🔥 Role Selection UI */}
      <div className="flex flex-col items-center justify-center h-full space-y-6 pt-24 text-black">
        <div className="bg-white bg-opacity-80 p-6 rounded-lg shadow-lg max-w-md w-full text-center space-y-4">
          <h1 className="text-4xl font-bold">Select Your Role</h1>
          <p className="text-lg">Choose your industry role to proceed with authentication.</p>

          {account ? (
            <p className="text-green-600 font-semibold">Connected: {account}</p>
          ) : (
            <p className="text-red-500">Please connect MetaMask to continue.</p>
          )}

          {/* 🔥 Buttons */}
          {["Manufacturer", "Distributor", "HealthcareProvider", "Regulator"].map((role) => (
            <button
              key={role}
              onClick={() => handleRoleSelect(role)}
              className="p-3 bg-[#0cc0cf] text-white rounded-lg hover:bg-opacity-100 hover:scale-105 transition transform shadow-lg w-full"
            >
              {role.replace(/([A-Z])/g, " $1").trim()}
            </button>
          ))}

          {/* 🔥 Status */}
          {loading && <p className="text-blue-500 font-semibold mt-4">Processing...</p>}
          {roleRequested && <p className="text-green-500 mt-4">Role request pending approval.</p>}
        </div>
      </div>
    </div>
  );
}
