"use client";

import Link from "next/link";

export default function Home() {
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
        <img src="/entities/PharmaChain-logotext.png" alt="PharmaChain Logo" className="w-[100px] h-[100px] object-contain" />
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center h-screen space-y-6 text-black text-center">
        <h1 className="text-4xl font-bold">Pharmaceutical Supply Chain Tracking</h1>
        <p className="text-lg max-w-2xl">Your one-stop solution for safe, verified, and efficient medicine tracking.</p>
        
        {/* Buttons */}
        <div className="flex space-x-4">
          <Link href="/verify">
            <button className="p-3 px-5 bg-[#0cc0cf] bg-opacity-60 text-white rounded-lg hover:bg-opacity-100 hover:scale-105 transition transform shadow-lg">
              Verify Your Medication
            </button>
          </Link>
          <Link href="/industry-login">
            <button className="p-3 px-5 bg-gray-600 bg-opacity-60 text-white rounded-lg hover:bg-opacity-100 hover:scale-105 transition transform shadow-lg">
              Industry Login
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
