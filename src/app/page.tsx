"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function Home() {
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading, setLoading] = useState(false); // Overall loading state
  const router = useRouter();

  const connectMetaMask = async (buttonNumber: number) => {
    if (typeof window.ethereum === "undefined") {
      window.alert("MetaMask is not installed. Please install MetaMask to proceed.");
      return;
    }

    setLoading(true);
    buttonNumber === 1 ? setLoading1(true) : setLoading2(true);

    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });

      if (accounts.length > 0) {
        console.log("Connected account:", accounts[0]);

        // Add a short delay to make the loading spinner visible
        setTimeout(() => {
          router.push(buttonNumber === 1 ? "/verify" : "/role");
        }, 1200); // 1.2 seconds
      }
    } catch (error: any) {
      const errorMsg = error?.message || "MetaMask connection failed. Please try again.";
      alert("MetaMask connection failed: " + errorMsg);
      setLoading(false);
      setLoading1(false);
      setLoading2(false);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center p-10 relative bg-cover bg-center overflow-hidden">
      <div className="fixed inset-0 -z-10">
        <Image
          src={"/bg.jpg"}
          alt={"background image"}
          fill
          className="object-cover brightness-40"
        />
      </div>

      {/* Loading Animation */}
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="w-16 h-16 border-4 border-t-[#0cc0cf] border-white rounded-full animate-spin mb-4"></div>
          <p className="text-white text-lg animate-pulse">Connecting to MetaMask...</p>
        </div>
      )}
      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center space-y-6 text-white text-center"></div>
      <h1 className="text-6xl font-bold my-2">Pharmaceutical Supply Chain Tracking</h1>
      <p className="text-lg mb-3">Your one-stop solution for safe, verified, and efficient medicine tracking.</p>

      {/* Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={() => connectMetaMask(1)}
          className="p-3 px-5 bg-[#0cc0cf] bg-opacity-60 text-white rounded-lg hover:bg-opacity-100 hover:scale-105 transition transform shadow-lg"
          disabled={loading1 || loading} // Disable button when loading
        >
          {loading1 ? "Connecting..." : "Verify Your Medication"}
        </button>

        <button
          onClick={() => connectMetaMask(2)}
          className="p-3 px-5 bg-gray-600 bg-opacity-60 text-white rounded-lg hover:bg-opacity-100 hover:scale-105 transition transform shadow-lg"
          disabled={loading2 || loading} // Disable button when loading
        >
          {loading2 ? "Connecting..." : "Industry Login"}
        </button>
      </div>
    </div>
  );
}
