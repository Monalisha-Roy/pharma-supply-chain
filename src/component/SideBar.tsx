"use client";
import React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import SideBarItem from "./SideBarItem";

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
  const userAddress = "0x34kjfs5........fasd4"; // Example address

  return (
    <aside className="h-screen w-72 hidden sm:flex flex-col bg-[#82e3f2]">
      <nav className="h-full flex flex-col">
        <div className="flex items-center justify-center gap-2.5 border">
          <Image src={"/logo.png"} alt="logo" width={80} height={40} />
          <h1 className="text-[#0b1618] text-2xl font-bold">PharmaCo</h1>
        </div>
        <div className="flex-1 overflow-y-auto px-3 my-2">
          <ul className="list-none p-0 m-0">
            {sidebarItems.map((item) => (
              <SideBarItem
                key={item.route}
                icon={item.icon}
                text={item.text}
                route={item.route}
                pathname={pathname}
              />
            ))}
          </ul>
        </div>
        <div className="p-4 flex items-center justify-center gap-2 text-md text-[#0b1618]">
          <div className="w-16 h-16 rounded-full bg-white"/>
          {userAddress}
        </div>
      </nav>
    </aside>
  );
}