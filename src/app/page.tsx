"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function Home() {
  const [account, setAccount] = useState<string | null>(null);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const router = useRouter();

  // MetaMask connection handler
  const connectMetaMask = async (buttonNumber: number) => {
    if (typeof window.ethereum === "undefined") {
      window.alert("MetaMask is not installed. Please install MetaMask to proceed.");
      return;
    }

    if (buttonNumber === 1) {
      setLoading1(true);
    } else {
      setLoading2(true);
    }

    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });

      if (accounts.length > 0) {
        setAccount(accounts[0]);
        console.log("Connected account:", accounts[0]);

        setTimeout(() => {
          router.push(buttonNumber === 1 ? "/verify" : "/role");
        }, 10);
      }
    } catch (error: any) {
      const errorMsg = error?.message || "MetaMask connection failed. Please try again.";
      alert("MetaMask connection failed: " + errorMsg);
    } finally {
      setLoading1(false);
      setLoading2(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center p-10 relative bg-cover bg-center overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={"/bg.jpg"}
          alt={"background image"}
          layout="fill"
          objectFit="cover"
          className="brightness-40"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-screen space-y-6 text-white text-center">
        <h1 className="text-6xl font-bold">Pharmaceutical Supply Chain Tracking</h1>
        <p className="text-lg">Your one-stop solution for safe, verified, and efficient medicine tracking.</p>

        {/* Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={() => connectMetaMask(1)}
            className="p-3 px-5 bg-[#0cc0cf] bg-opacity-60 text-white rounded-lg hover:bg-opacity-100 hover:scale-105 transition transform shadow-lg"
            disabled={loading1} // Disable button when loading1
          >
            {loading1 ? "Connecting..." : "Verify Your Medication"}
          </button>

          <button
            onClick={() => connectMetaMask(2)}
            className="p-3 px-5 bg-gray-600 bg-opacity-60 text-white rounded-lg hover:bg-opacity-100 hover:scale-105 transition transform shadow-lg"
            disabled={loading2} // Disable button when loading2
          >
            {loading2 ? "Connecting..." : "Industry Login"}
          </button>
        </div>
      </div>
    </div>
  );
}