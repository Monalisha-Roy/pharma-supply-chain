import { LuLayoutDashboard } from "react-icons/lu";
import { MdEvent, MdAccountCircle } from "react-icons/md";
import { PiUsersThreeFill } from "react-icons/pi";
import { FiSettings } from "react-icons/fi";
import SideBar from "../component/SideBar";

export default function DashboardPage() {
  const sidebarItems = [
    {
      icon: <LuLayoutDashboard className="h-7 w-7" />,
      text: "Dashboard",
      route: "/dashboard",
    },
    {
      icon: <MdEvent className="h-7 w-7" />,
      text: "Events",
      route: "/events",
    },
    {
      icon: <PiUsersThreeFill className="h-7 w-7" />,
      text: "All Clubs",
      route: "/allclubs",
    },
    {
      icon: <MdAccountCircle className="h-7 w-7" />,
      text: "My Account",
      route: "/myaccount",
    },
    {
      icon: <FiSettings className="h-7 w-7" />,
      text: "Settings",
      route: "/settings",
    },
  ];

  return (
    <div className="flex">
      <SideBar sidebarItems={sidebarItems} />
      <main className="flex-1 p-4">
        <h1>Dashboard Content</h1>
      </main>
    </div>
  );
}
