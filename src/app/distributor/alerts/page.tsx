import SideBar from "@/component/SideBar";
import { GoAlertFill } from "react-icons/go";
import { MdDashboard, MdOutlineSettings } from "react-icons/md";
import { TbTruckDelivery } from "react-icons/tb";

export default function DistrubutorAlerts() {

    const sidebarItems = [
                {
                    icon: <MdDashboard />,
                    text: "Dashboard",
                    route: "/distributor"
                },
                {
                    icon: <TbTruckDelivery />,
                    text: "Shipments",
                    route: "/distributor/shipments"
                },
                {
                    icon: <GoAlertFill />,
                    text: "Alerts",
                    route: "/distributor/alerts"
                },
                {
                    icon: <MdOutlineSettings />,
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
                
                {/* Active Shipments Table */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">Active Shipments</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="border border-gray-300 p-3 text-left">Batch ID</th>
                                    <th className="border border-gray-300 p-3 text-left">From & To</th>
                                    <th className="border border-gray-300 p-3 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Sample Data Row */}
                                <tr className="bg-gray-100">
                                    <td className="border border-gray-300 p-3">BATCH1234</td>
                                    <td className="border border-gray-300 p-3">New York → Los Angeles</td>
                                    <td className="border border-gray-300 p-3">
                                        <button className="px-4 py-2 bg-[#0cc0cf] text-white rounded-lg hover:bg-opacity-80">
                                            Update Location
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 p-3">BATCH5678</td>
                                    <td className="border border-gray-300 p-3">Chicago → Houston</td>
                                    <td className="border border-gray-300 p-3">
                                        <button className="px-4 py-2 bg-[#0cc0cf] text-white rounded-lg hover:bg-opacity-80">
                                            Update Location
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
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
