"use client";

import Link from "next/link";

function Navbar() {
  return (
    <div className="w-full flex justify-between items-center p-4 bg-white shadow-md fixed top-0 left-0 right-0 text-black">
      <div className="flex space-x-6">
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
      </div>
      {/* Company Logo */}
      <img src="/entities/PharmaChain-logotext.png" alt="PharmaChain Logo" className="w-[100px] h-[100px] object-contain" />
    </div>
  );
}

export default Navbar;
