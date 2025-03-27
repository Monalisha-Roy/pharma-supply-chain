"use client";
import { LuLayoutDashboard } from "react-icons/lu";
import { MdEvent } from "react-icons/md";
import { PiUsersThreeFill } from "react-icons/pi";
import { MdAccountCircle } from "react-icons/md";
import { FiSettings } from "react-icons/fi";
import Image from "next/image";
import logo from "/public/logo.png";
import SideBarItem from "./SideBarItem";
import { usePathname } from "next/navigation";

export default function SideBar() {
  const pathname = usePathname();

  return (
    <aside className="h-screen sm:w-80 sm:flex flex-col sm:flex-row hidden ">
      <nav className="h-full w-full sm:w-64 flex flex-col bg-[#80e2f2]">
        <div className="mb-10 flex flex-col items-center text-white font-extrabold text-2xl">
          <Image
            src={logo}
            height={60}
            width={100}
            alt="PharmaCo Logo"
            className="rounded-full"
          />
          <span className="mt-2">PharmaCo</span>
        </div>
        <div className="flex-1">
          <SideBarItem
            icon={
              <LuLayoutDashboard
                className={`${pathname === "/dashboard" ? "text-white" : "text-grey"
                  } h-7 w-7`}
              />
            }
            text={"Dashboard"}
            route={"/dashboard"}
            pathname={pathname}
          />
          <SideBarItem
            icon={
              <MdEvent
                className={`${pathname === "/events" ? "text-white" : "text-grey"
                  } h-7 w-7`}
              />
            }
            route={"/events"}
            text={"Events"}
            pathname={pathname}
          />
          <SideBarItem
            icon={
              <PiUsersThreeFill
                className={`${pathname === "/allclubs" ? "text-white" : "text-grey"
                  } h-7 w-7`}
              />
            }
            route={"/allclubs"}
            text={"All Clubs"}
            pathname={pathname}
          />
          <SideBarItem
            icon={
              <MdAccountCircle
                className={`${pathname === "/myaccount" ? "text-white" : "text-grey"
                  } h-7 w-7`}
              />
            }
            route={"/myaccount"}
            text={"My Account"}
            pathname={pathname}
          />
        </div>
        <ul className="flex-0">
          <SideBarItem
            icon={
              <FiSettings
                className={`${pathname === "/settings" ? "text-white" : "text-grey"
                  } h-7 w-7`}
              />
            }
            route={"/settings"}
            text={"Settings"}
            pathname={pathname}
          />
        </ul>
      </nav>
    </aside>
  );
}
