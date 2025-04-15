import SideBar from "@/component/SideBar";
import { MdDashboard, MdOutlineSettings } from "react-icons/md";
import { TbTruckDelivery } from "react-icons/tb";
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
                
                {/* GPS Tracking (Landscape Box) */}
                <div className="bg-[#0cc0cf] bg-opacity-60 text-white rounded-xl shadow-lg p-6 h-52 flex items-center justify-center text-2xl font-semibold">
                    GPS Tracking of Shipments
                </div>

                {/* Bottom Two Boxes */}
                <div className="grid grid-cols-2 gap-6">
                    
                    {/* Shipments in Transit */}
                    <div className="bg-gray-600 bg-opacity-60 text-white rounded-xl shadow-lg p-6 h-48 flex items-center justify-center text-xl font-semibold">
                        Shipments in Transit
                    </div>

                    {/* Temperature Alerts */}
                    <div className="bg-red-500 bg-opacity-60 text-white rounded-xl shadow-lg p-6 h-48 flex items-center justify-center text-xl font-semibold">
                        Temperature Alerts
                    </div>
                </div>
            </div>
        </div>
    );
}
