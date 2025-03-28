"use client";
import Link from "next/link";
import Image from "next/image";

export default function IndustryLogin() {
  return (
    <div className="w-full h-screen flex flex-col items-center p-10 relative overflow-hidden">
      {/* Background Image with reduced brightness */}
      <div className="fixed inset-0 -z-10">
        <Image
          src={"/bg.jpg"}
          alt={"background image"}
          fill
          style={{ objectFit: "cover" }}
          className="brightness-40"
          priority
        />
      </div>
      
      {/* Main Content */}
      <div className="flex flex-col items-center justify-center h-full space-y-6 text-black text-center pt-24">
        <div className="bg-white bg-opacity-80 p-6 rounded-lg shadow-lg flex flex-col items-center space-y-4 w-full max-w-md text-center">
          <h1 className="text-4xl font-bold">Select Your Role</h1>
          <p className="text-lg max-w-2xl">Choose your industry role to proceed with authentication.</p>

          {/* Role Selection */}
          <div className="flex flex-col space-y-4 w-full">
            <Link href="/industry-login/manufacturer">
              <button className="p-3 bg-[#0cc0cf] text-white rounded-lg hover:bg-opacity-100 hover:scale-105 transition transform shadow-lg w-full">
                Manufacturer
              </button>
            </Link>
            <Link href="/industry-login/distributor">
              <button className="p-3 bg-[#0cc0cf] text-white rounded-lg hover:bg-opacity-100 hover:scale-105 transition transform shadow-lg w-full">
                Distributor
              </button>
            </Link>
            <Link href="/industry-login/healthcareprovider">
              <button className="p-3 bg-[#0cc0cf] text-white rounded-lg hover:bg-opacity-100 hover:scale-105 transition transform shadow-lg w-full">
                Healthcare Provider
              </button>
            </Link>
            <Link href="/industry-login/regulator">
              <button className="p-3 bg-[#0cc0cf] text-white rounded-lg hover:bg-opacity-100 hover:scale-105 transition transform shadow-lg w-full">
                Regulator
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}