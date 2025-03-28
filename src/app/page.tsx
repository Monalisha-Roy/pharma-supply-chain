"use client";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div
      className="w-full h-screen flex flex-col items-center p-10 relative bg-cover bg-center overflow-hidden"
    >
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
<<<<<<< HEAD
      <div className="relative z-10 flex flex-col items-center justify-center h-full space-y-6 text-white text-center">
        <h1 className="text-6xl font-bold">Pharmaceutical Supply Chain Tracking</h1>
        <p className="text-lg">Your one-stop solution for safe, verified, and efficient medicine tracking.</p>
=======
      <div className="relative z-10 flex flex-col items-center justify-center h-screen space-y-6 text-white text-center">

        
        {/* Logo with Shadow */}
        <Image 
          src="/logo.png" 
          alt="Company Logo" 
          width={180} 
          height={180} 
          className="mb-6 drop-shadow-2xl"
        />

        <h1 className="text-6xl font-bold">Pharmaceutical Supply Chain Tracker.</h1>
        <p className="text-lg max-w-2xl">Your one-stop solution for safe, verified, and efficient medicine tracking.</p>

>>>>>>> 09e22c02d9edcd1bf37c35458534775e655c401d

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
