"use client";

import Navbar from "@/component/navbar";
import Image from "next/image";

export default function About() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center p-10 relative">
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
      
      <Navbar />
      
      {/* Main Content - Reduced height */}
      <div className="flex flex-col items-center justify-start mt-20 space-y-6 text-center max-w-3xl bg-white bg-opacity-90 rounded-lg p-8 shadow-lg w-full">
        <h1 className="text-4xl font-extrabold text-[#0cc0cf] drop-shadow-md">About PharmaCo</h1>
        
        <div className="space-y-4">
          <p className="text-lg leading-relaxed">
            <span className="font-semibold">PharmaCo</span> is dedicated to ensuring the authenticity and safety of pharmaceuticals
            through blockchain-based tracking. Our mission is to combat counterfeit drugs and 
            improve transparency in the pharmaceutical supply chain.
          </p>
          
          <p className="text-lg leading-relaxed">
            With our advanced tracking system, manufacturers, suppliers, and consumers can 
            verify the legitimacy of medications with ease. Join us in building a safer and 
            more reliable pharmaceutical industry.
          </p>
        </div>
        
        {/* Contact Us Section */}
        <div className="w-full pt-6 border-t border-gray-200 mt-4">
          <h2 className="text-2xl font-bold text-[#0cc0cf]">Contact Us</h2>
          <div className="mt-3 space-y-1">
            <p className="text-lg">📍 Kokrajhar, BTR, Assam - 783370</p>
            <p className="text-lg">🏛️ Central Institute of Technology Kokrajhar</p>
            <p className="text-lg">📞 +91 98765 XXXXX</p>
            <p className="text-lg">✉️ contact@pharmacolimited.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}