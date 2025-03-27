"use client";

import Link from "next/link";

export default function IndustryLogin() {
  return (
    <div 
      className="w-full min-h-screen flex flex-col items-center p-10 relative bg-cover bg-center"
      style={{ backgroundImage: "url('/entities/PharmaChain-bg.png')" }}
    >
      {/* Top Bar */}
      <div className="w-full flex justify-between items-center p-4 bg-white shadow-md fixed top-0 left-0 right-0 text-black">
        <div className="flex space-x-6">
          <Link href="/about" className="hover:text-gray-600 transition">About</Link>
          <Link href="/contact" className="hover:text-gray-600 transition">Contact</Link>
          <Link href="/services" className="hover:text-gray-600 transition">Services</Link>
        </div>
        {/* Company Logo */}
        <img src="/entities/PharmaChain-logo.png" alt="PharmaChain Logo" className="w-[100px] h-[100px] object-contain" />
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center h-screen space-y-6 text-black text-center pt-24">
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

        {/* Back Button */}
        <Link href="/">
          <button className="mt-4 p-3 px-5 bg-gray-600 text-white rounded-lg hover:bg-opacity-100 hover:scale-105 transition transform shadow-lg">
            Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
}
