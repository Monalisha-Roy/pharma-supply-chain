"use client";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div
      className="w-full min-h-screen flex flex-col items-center p-10 relative bg-cover bg-center overflow-hidden"
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
      <div className="relative z-10 flex flex-col items-center justify-center h-screen space-y-6 text-black text-center">
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
