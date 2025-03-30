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
  const router = useRouter();

  // MetaMask connection handler
  const connectMetaMask = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          console.log("Connected account:", accounts[0]);
          router.push("/role");
        }
      } catch (error: any) {
        if (error?.message) {
          alert("MetaMask connection failed: " + error.message);
        } else {
          alert("MetaMask connection failed. Please try again.");
        }
      }
    } else {
      alert("MetaMask is not installed. Please install MetaMask to proceed.");
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
          <Link href="/verify">
            <button className="p-3 px-5 bg-[#0cc0cf] bg-opacity-60 text-white rounded-lg hover:bg-opacity-100 hover:scale-105 transition transform shadow-lg">
              Verify Your Medication
            </button>
          </Link>
          <button
            onClick={connectMetaMask}
            className="p-3 px-5 bg-gray-600 bg-opacity-60 text-white rounded-lg hover:bg-opacity-100 hover:scale-105 transition transform shadow-lg"
          >
            Industry Login
          </button>
        </div>
      </div>
    </div>
  );
}
