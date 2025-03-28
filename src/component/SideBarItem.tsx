// SideBarItem.tsx
"use client";
import Link from "next/link";
import React from "react";

interface SideBarItemProps {
  icon: React.ReactElement;
  text: string;
  route: string;
  pathname: string;
}

function SideBarItem({ icon, text, route, pathname }: SideBarItemProps) {
  const isActive = pathname === route || pathname.startsWith(`${route}/`);

  return (
    <li className="mb-1 w-full">
      <Link
      href={route}
      className={`flex items-center p-4 rounded-lg transition-colors
        ${isActive ? 'bg-[#2ebfd6] text-white' : 'text-[#0b1618] hover:bg-[#2ebfd6] hover:text-white'}`}
      >
      {React.cloneElement(icon as React.ReactElement<{ className?: string }>, {
        className: `text-xl mr-4 transition-colors '
        } ${(icon.props as { className?: string }).className || ""}`,
      })}
      <span className="text-lg font-medium">{text}</span>
      </Link>
    </li>
  );
}

export default SideBarItem;