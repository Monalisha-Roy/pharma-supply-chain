"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import SideBarItem from "./SideBarItem";
import { IoMdContact } from "react-icons/io";

interface SidebarItem {
  icon: React.ReactElement;
  text: string;
  route: string;
}

interface SideBarProps {
  sidebarItems?: SidebarItem[]; // Make prop optional
}

export default function SideBar({ sidebarItems = [] }: SideBarProps) {
  const pathname = usePathname();
  const [userAddress, setUserAddress] = useState<string>("");

  useEffect(() => {
    const fetchUserAddress = async () => {
      if (typeof window.ethereum !== "undefined") {
        try {
          const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
          setUserAddress(accounts[0]);
        } catch (error) {
          console.error("Error fetching user address:", error);
        }
      } else {
        console.warn("MetaMask is not installed.");
      }
    };

    fetchUserAddress();
  }, []);

  // Format the address to show only the first 6 and last 4 characters
  const formattedAddress = userAddress
    ? `${userAddress.slice(0, 6)}.........${userAddress.slice(-6)}`
    : "Not Connected";

  return (
    <aside className="h-screen w-72 fixed sm:flex flex-col bg-[#82e3f2]">
      <nav className="h-full flex flex-col">
        <div className="flex items-center h-20 justify-center gap-2.5 m-5">
          <Image
            src="/logo.png"
            alt="logo"
            width={80}
            height={80}
            style={{ width: "auto", height: "auto" }} 
          />
          <h1 className="text-[#0b1618] text-2xl font-bold">PharmaCo</h1>
        </div>
        <div className="flex-1 px-3 my-2">
          <ul className="list-none p-0 m-0">
            {sidebarItems.map((item) => (
              <SideBarItem
                key={item.route}
                icon={item.icon}
                text={item.text}
                route={item.route}
                pathname={pathname || ""}
              />
            ))}
          </ul>
        </div>
        <div className="p-3 flex items-center justify-center gap-2 text-md text-[#0b1618]">
          <div>
            <IoMdContact size={60} />
          </div>
          <div className="flex-col gap-1 font-bold text-gray-500">
            <p className="text-gray-700">User Address</p>
            {formattedAddress}
          </div>
        </div>
      </nav>
    </aside>
  );
}