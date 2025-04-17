'use client';
import SideBar from "@/component/SideBar";
import { MdDashboard, MdOutlineSettings } from "react-icons/md";
import { GoAlertFill } from "react-icons/go";
import { MdVerified } from "react-icons/md";
import { BatchStatus } from "@/types/batchtypes";
import BatchTable from "@/component/batchTable";

export const sidebarItems = [
    { icon: <MdDashboard />, text: "Dashboard", route: "/healthcareprovider" },
    { icon: <MdVerified />, text: "Verification", route: "/healthcareprovider/verify" },
    { icon: <GoAlertFill />, text: "Alerts", route: "/healthcareprovider/alerts" },
    { icon: <MdOutlineSettings />, text: "Settings", route: "/healthcareprovider/settings" },
];

export default function healthcareProvider() {
    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <aside className="w-64 h-screen sticky top-0 bg-white shadow-md">
                <SideBar sidebarItems={sidebarItems} />
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto w-full bg-teal-50">
                <div className="max-w-7xl mx-auto w-11/12">
                    <h1 className="text-xl text-black">Dashboard</h1>
                    <hr className="text-gray-400" />
                    <h2 className="text-3xl font-gold text-gray-700 mt-10 mb-2">Batches Received</h2>
                    <BatchTable status={BatchStatus.Delivered}/>
                </div>
            </main>
        </div>
    );
}
