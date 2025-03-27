import SideBar from "@/component/SideBar";
import { FaUndo } from "react-icons/fa";
import { GiMedicinePills } from "react-icons/gi";
import { MdDashboard, MdOutlineSettings } from "react-icons/md";
import { TbTruckDelivery } from "react-icons/tb";

export default function Batches() {
    const sidebarItems = [
        {
            icon: <MdDashboard />,
            text: "Dashboard",
            route: "/manufacturer"
        },
        {
            icon: <GiMedicinePills />,
            text: "Batches",
            route: "/manufacturer/batches"
        },
        {
            icon: <TbTruckDelivery />,
            text: "Transfers",
            route: "/manufacturer/transfers"
        },
        {
            icon: <FaUndo />,
            text: "Recall",
            route: "/manufacturer/recall"
        },
        {
            icon: <MdOutlineSettings />,
            text: "Settings",
            route: "/manufacturer/settings"
        }
    ];

    return (
        <div className="flex bg-white">
            <SideBar sidebarItems={sidebarItems} />
            <div className="max-w-7xl mx-auto p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">ACTIVE BATCHES</h1>
            </div>

            <div className="bg-white rounded-lg shadow-sm border">
                <table className="w-full text-sm">
                <thead className="bg-gray-50">
                    <tr>
                    <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BATCH ID</th>
                    <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STATUS</th>
                    <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ACTIONS</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    <tr>
                    <td className="px-8 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#123</td>
                    <td className="px-8 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
                        In Transit
                        </span>
                    </td>
                    <td className="px-8 py-4 whitespace-nowrap space-x-2">
                        <button className="text-red-600 hover:text-red-900 text-sm font-medium">Recall</button>
                        <button className="text-blue-600 hover:text-blue-900 text-sm font-medium">View</button>
                    </td>
                    </tr>

                    <tr>
                    <td className="px-8 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#343</td>
                    <td className="px-8 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                        </span>
                    </td>
                    <td className="px-8 py-4 whitespace-nowrap space-x-2">
                        <button className="text-blue-600 hover:text-blue-900 text-sm font-medium">Transfer</button>
                        <button className="text-blue-600 hover:text-blue-900 text-sm font-medium">View</button>
                    </td>
                    </tr>
                </tbody>
                </table>
            </div>

            <button className="bg-blue-600 mt-10 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                CREATE NEW BATCH
                </button>
            </div>
        </div>
    );
};