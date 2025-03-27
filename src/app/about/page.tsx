"use client";

import Navbar from "@/component/navbar";
import Link from "next/link";

export default function About() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center p-10 relative bg-white text-gray-800">
      <Navbar />
      {/* Main Content */}
      <div className="flex flex-col items-center justify-center h-screen space-y-8 text-center max-w-3xl">
        <h1 className="text-5xl font-extrabold text-[#0cc0cf] drop-shadow-md">About PharmaChain</h1>
        <p className="text-lg leading-relaxed px-6">
          <span className="font-semibold">PharmaChain</span> is dedicated to ensuring the authenticity and safety of pharmaceuticals
          through blockchain-based tracking. Our mission is to combat counterfeit drugs and 
          improve transparency in the pharmaceutical supply chain.
        </p>
        
        <p className="text-lg leading-relaxed px-6">
          With our advanced tracking system, manufacturers, suppliers, and consumers can 
          verify the legitimacy of medications with ease. Join us in building a safer and 
          more reliable pharmaceutical industry.
        </p>
        
        {/* CTA Button */}
        <Link href="/services">
          <button className="mt-4 p-3 px-6 bg-[#0cc0cf] text-white rounded-lg hover:bg-opacity-90 hover:scale-105 transition transform shadow-md">
            Explore Our Services
          </button>
        </Link>
      </div>
      
      {/* Contact Us Section */}
      <div className="mt-16 text-center border-t pt-8 w-full max-w-3xl">
        <h2 className="text-3xl font-bold text-[#0cc0cf]">Contact Us</h2>
        <p className="text-lg mt-4">📍 Kokrajhar, BTR, Assam - 783370</p>
        <p className="text-lg">🏛️ Central Institute of Technology Kokrajhar</p>
        <p className="text-lg">📞 +91 98765 43210</p>
        <p className="text-lg">✉️ contact@pharmachain.com</p>
      </div>
    </div>
  );
}
