"use client";

import Navbar from "@/component/navbar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

export default function Verify() {
  const router = useRouter();
  const [verificationId, setVerificationId] = useState("");
  
  const handleSubmit = () => {
    if (verificationId) {
      router.push(`/druginfo?verificationId=${verificationId}`);
    }
  };

  return (
    <div className="w-full min-h-screen relative">
      <div className="absolute inset-0">
        <Image
          src={"/verifyBg.jpg"}
          alt={"background image"}
          layout="fill"
          objectFit="cover"
          className="brightness-40"
        />
      </div>

      {/* Content Wrapper */}
      <div className="relative z-10">
        <Navbar />

        {/* Main Content */}
        <div className="flex flex-col items-center justify-center h-screen space-y-6 text-black text-center pt-24">
          <div className="flex flex-col md:flex-row items-center justify-center space-x-6 w-full max-w-4xl">
            {/* Verification using Number */}
            <div className="bg-gray-700 bg-opacity-30 p-10 rounded-lg shadow-2xl flex flex-col items-center space-y-6 w-full md:w-1/2 text-center h-96">
              <h2 className="text-2xl font-bold text-white">Enter Verification ID</h2>
              <input 
                type="text" 
                placeholder="Enter Verification ID" 
                className="p-3 border rounded-md w-full" 
                value={verificationId} 
                onChange={(e) => setVerificationId(e.target.value)}
              />
              <button 
                onClick={handleSubmit} 
                className="p-3 px-5 bg-[#0cc0cf] text-white rounded-lg hover:bg-opacity-100 hover:scale-105 transition transform shadow-lg w-full"
              >
                Submit & Verify
              </button>
            </div>

            {/* Image Scanning */}
            <div className="bg-gray-700 bg-opacity-30 p-10 rounded-lg shadow-2xl flex flex-col items-center space-y-6 w-full md:w-1/2 text-center h-96">
              <h2 className="text-2xl font-bold text-white">Scan QR Code</h2>
              <input type="file" accept="image/*" className="p-3 border rounded-md w-full"/>
              <button 
                className="p-3 px-5 bg-[#0cc0cf] text-white rounded-lg hover:bg-opacity-100 hover:scale-105 transition transform shadow-lg w-full"
              >
                Submit & Verify
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
