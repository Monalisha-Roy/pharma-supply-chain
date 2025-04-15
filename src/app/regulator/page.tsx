import SideBar from "@/component/SideBar";
import { MdDashboard, MdOutlineSettings } from "react-icons/md";
import { GoAlertFill } from "react-icons/go";
import { IoIosContacts } from "react-icons/io";

export default function Regulator() {

    const sidebarItems = [
            {
                icon: <MdDashboard size={32}/>,
                text: "Dashboard",
                route: "/regulator"
            },
            {
                icon: <IoIosContacts size={38}/>,
                text: "RoleRequests",
                route: "/regulator/roleRequests"
            },
            {
                icon: <GoAlertFill size={32}/>,
                text: "Alerts",
                route: "/distributor/alerts"
            },
            {
                icon: <MdOutlineSettings size={32}/>,
                text: "Settings",
                route: "/distributor/settings"
            }
        ];

    return (
        <div className="w-full min-h-screen bg-white flex">
            {/* Sidebar */}
            <SideBar sidebarItems={sidebarItems}/>

            {/* Main Content */}
            <div className="flex-1 p-6 ml-10 mt-10 flex flex-col space-y-6">
                
                
            </div>
        </div>
    );
}
