"use client";

import Navbar from "@/component/navbar";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { BsQrCode } from "react-icons/bs";
import { MdOutlineCloudUpload } from "react-icons/md";

export default function Verify() {
  const router = useRouter();
  const [verificationId, setVerificationId] = useState("");
  const [qrFileName, setQrFileName] = useState<string | null>(null);

  const handleSubmit = () => {
    if (verificationId) {
      router.push(`/druginfo?verificationId=${verificationId}`);
    }
  };

  const handleQrUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setQrFileName(file.name);
    } else {
      setQrFileName(null);
    }
  };

  return (
    <div className="w-full min-h-screen relative">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={"/bg.jpg"}
          alt={"background image"}
          fill
          style={{ objectFit: "cover" }}
          className="brightness-40"
          priority
        />
      </div>

      {/* Content Wrapper */}
      <div className="relative z-10">
        <Navbar />

        {/* Main Content */}
        <div className="flex flex-col items-center justify-center min-h-screen py-24 px-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-12 w-full max-w-6xl">
            {/* Verification ID Section */}
            <div className="bg-white bg-opacity-90 p-10 rounded-2xl shadow-xl flex flex-col items-center space-y-8 w-full md:w-1/2 h-[525px]">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-gray-800">
                  Verify with Batch ID
                </h2>
                <p className="text-gray-600">Enter your Batch ID</p>
              </div>

              <div className="w-full space-y-6 text-gray-500">
                <input
                  type="text"
                  placeholder="e.g. 1234567890"
                  className="p-4 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-[#0cc0cf] focus:border-transparent text-lg"
                  value={verificationId}
                  onChange={(e) => setVerificationId(e.target.value)}
                />
                <button
                  onClick={handleSubmit}
                  className="p-4 bg-[#0cc0cf] text-white rounded-lg hover:bg-[#0aa8b8] transition-all duration-300 shadow-md w-full font-medium text-lg"
                >
                  Verify Product
                </button>
              </div>

              <div className="mt-auto text-center text-gray-500 text-sm">
                <p>Find the Batch ID on your product packaging</p>
              </div>
            </div>

            {/* QR Code Section */}
            <div className="bg-white bg-opacity-90 p-10 rounded-2xl shadow-xl flex flex-col items-center space-y-8 w-full md:w-1/2 h-[525px]">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-gray-800">
                  Scan QR Code
                </h2>
                <p className="text-gray-600">Upload product QR from device</p>
              </div>

              <div className="flex items-center justify-center bg-gray-100 p-10 rounded-lg ">
                <BsQrCode className="text-gray-400 w-40 h-40" />
              </div>
              
              <div className="w-full space-y-4">
              
                <label className="block">
                  <span className="sr-only">Choose QR image</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="qr-upload"
                    onChange={handleQrUpload}
                  />
                  {qrFileName && (
                  <p className="text-sm text-gray-600 text-center">
                    Selected File: <strong>{qrFileName}</strong>
                  </p>
                )}
                  <label
                    htmlFor="qr-upload"
                    className="p-4 bg-[#0cc0cf] text-white rounded-lg hover:bg-[#0aa8b8] transition-all duration-300 shadow-md w-full font-medium text-lg text-center cursor-pointer flex items-center justify-center gap-2"
                  >
                    <MdOutlineCloudUpload size={28} />
                    <span>Upload QR Image</span>
                  </label>
                </label>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
