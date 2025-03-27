"use client";

import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

export default function IndustryRoleLogin() {
  const router = useRouter();
  const { role } = useParams(); // Get role from URL
  const [credentials, setCredentials] = useState({ username: "", password: "" });

  const handleLogin = () => {
    console.log(`Logging in as ${role}:`, credentials);
    // In future: Connect to MetaMask here
    router.push(`/dashboard/${role}`); // Redirect after login (update later)
  };

  return (
    <div 
      className="w-full min-h-screen flex flex-col items-center p-10 relative bg-cover bg-center"
      style={{ backgroundImage: "url('/entities/PharmaChain-bg.png')" }}
    >
      

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center h-screen space-y-6 text-black text-center pt-24">
        <div className="bg-white bg-opacity-80 p-6 rounded-lg shadow-lg flex flex-col items-center space-y-4 w-full max-w-md text-center">
          <h1 className="text-4xl font-bold capitalize">Login as {role}</h1>
          <p className="text-lg">Enter your credentials to proceed.</p>

          {/* Login Form */}
          <input 
            type="text" 
            placeholder="Username" 
            className="p-3 border rounded-md w-full" 
            value={credentials.username} 
            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="p-3 border rounded-md w-full" 
            value={credentials.password} 
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
          />

          {/* Submit Button */}
          <button 
            onClick={handleLogin} 
            className="mt-4 p-3 px-5 bg-[#0cc0cf] text-white rounded-lg hover:bg-opacity-100 hover:scale-105 transition transform shadow-lg w-full"
          >
            Login
          </button>
        </div>

        {/* Back Button */}
        <Link href="/industry-login">
          <button className="mt-4 p-3 px-5 bg-gray-600 text-white rounded-lg hover:bg-opacity-100 hover:scale-105 transition transform shadow-lg">
            Back to Role Selection
          </button>
        </Link>
      </div>
    </div>
  );
}
