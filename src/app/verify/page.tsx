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
          <div className="bg-white bg-opacity-80 p-6 rounded-lg shadow-lg flex flex-col items-center space-y-4 w-full max-w-md text-center">
            <h1 className="text-4xl font-bold">Verify Your Medication</h1>
            <p className="text-lg max-w-2xl">Upload a QR code or enter a verification ID to check authenticity.</p>

            {/* Verification Box */}
            <input type="file" accept="image/*" className="p-3 border rounded-md w-full"/>
            <input 
              type="text" 
              placeholder="Enter Verification ID" 
              className="p-3 border rounded-md w-full" 
              value={verificationId} 
              onChange={(e) => setVerificationId(e.target.value)}
            />
            
            {/* Submit Button */}
            <button 
              onClick={handleSubmit} 
              className="mt-4 p-3 px-5 bg-[#0cc0cf] text-white rounded-lg hover:bg-opacity-100 hover:scale-105 transition transform shadow-lg w-full"
            >
              Submit
            </button>
          </div>

          {/* Back Button */}
          <Link href="">
            <button className="mt-4 p-3 px-5 bg-gray-600 text-white rounded-lg hover:bg-opacity-100 hover:scale-105 transition transform shadow-lg">
              Back to Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}