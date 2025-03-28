"use client";
import SideBar from "@/component/SideBar";
import { MdDashboard, MdOutlineSettings } from "react-icons/md";
import { GiMedicinePills } from "react-icons/gi";
import { TbTruckDelivery } from "react-icons/tb";
import { FaUndo } from "react-icons/fa";
import { useState } from "react";


export default function Manufacturer() {
    const [isOpen, setIsOpen] = useState(false);

    const handleOpenCreateBatch = () => {
        setIsOpen(true);
    }

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
            
            <div className="max-w-6xl mx-auto p-6 flex flex-col items-start justify-between">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <div className="text-3xl font-bold text-gray-800 mb-2"># XX</div>
                        <div className="text-gray-500">ACTIVE BATCHES</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <div className="text-3xl font-bold text-gray-800 mb-2"># XX</div>
                        <div className="text-gray-500">BATCHES IN TRANSIT</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <div className="text-3xl font-bold text-gray-800 mb-2"># XX</div>
                        <div className="text-gray-500">RECALLS</div>
                    </div>

                </div>
                {isOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Create New Batch</h2>
                            <form>
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-medium mb-2">Drug Name</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border border-gray-300 text-gray-600 rounded-lg"
                                        placeholder="Enter Drug name"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-medium mb-2">Quantity</label>
                                    <input
                                        type="number"
                                        className="w-full p-2 border border-gray-300 text-gray-600  rounded-lg"
                                        placeholder="Enter quantity"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-medium mb-2">Date of Manufacture</label>
                                    <input
                                        type="date"
                                        className="w-full p-2 border border-gray-300 text-gray-600  rounded-lg"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-medium mb-2">Date of Expiry</label>
                                    <input
                                        type="date"
                                        className="w-full p-2 border border-gray-300 text-gray-600  rounded-lg"
                                    />
                                </div>
                                <div className="flex justify-end space-x-4">
                                    <button
                                        type="button"
                                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-[#36defc] text-white px-4 py-2 rounded-lg hover:bg-[#2ebfd6]"
                                    >
                                        Create
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <button
                    className="bg-[#36defc] text-white p-4 px-8 rounded-xl hover:bg-[#2ebfd6] hover:cursor-pointer flex items-center space-x-2"
                    onClick={handleOpenCreateBatch}
                >
                    <span className="text-4xl">+</span>
                    <span>CREATE NEW BATCH</span>
                </button>

                <div className="bg-white p-6 rounded-xl shadow-sm mt-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-6">RECENT ACTIVITY</h2>

                    <div className="border-b border-gray-100 pb-4 mb-4 last:border-0">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <div className="font-medium text-gray-900">Batch #1232</div>
                                <div className="text-gray-500 text-sm">
                                    <span className="mr-2">created</span>
                                    <span className="text-blue-500">→</span>
                                    <span className="mx-2">Transferred to distributor</span>
                                    <span className="text-blue-500">→</span>
                                    <span className="ml-2">…</span>
                                </div>
                            </div>
                            <div className="flex space-x-2 text-gray-400">
                                <span>●</span>
                                <span>●</span>
                                <span>●</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};