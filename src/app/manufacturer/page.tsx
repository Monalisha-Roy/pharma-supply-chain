"use client";
import SideBar from "@/component/SideBar";
import { MdDashboard, MdOutlineSettings } from "react-icons/md";
import { GiMedicinePills } from "react-icons/gi";
import { TbTruckDelivery } from "react-icons/tb";
import { FaUndo } from "react-icons/fa";
import { useState, useEffect } from "react";
import { loadContract } from "@/lib/contract";

export const sidebarItems = [
    { icon: <MdDashboard />, text: "Dashboard", route: "/manufacturer" },
    { icon: <GiMedicinePills />, text: "Batches", route: "/manufacturer/batches" },
    { icon: <TbTruckDelivery />, text: "Transfers", route: "/manufacturer/transfers" },
    { icon: <FaUndo />, text: "Recall", route: "/manufacturer/recall" },
    { icon: <MdOutlineSettings />, text: "Settings", route: "/manufacturer/settings" }
];

export default function Manufacturer() {
    const [account, setAccount] = useState<string | null>(null);
    const [contract, setContract] = useState<any>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [drugName, setDrugName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [mfgDate, setMfgDate] = useState("");
    const [expDate, setExpDate] = useState("");
    const [batchCounts, setBatchCounts] = useState({
        active: 0,
        inTransit: 0,
        recalled: 0,
    });

    useEffect(() => {
        const initializeContract = async () => {
            const { contract, account } = await loadContract();
            setContract(contract);
            setAccount(account);
        };
        initializeContract();
    }, []);

    useEffect(() => {
        if (contract && account) {
            fetchBatchStatusCounts();
        }
    }, [contract, account]);

    const handleCreateBatch = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!contract || !account) {
            alert("Contract or account not available.");
            return;
        }

        try {
            const mfgTimestamp = Math.floor(new Date(mfgDate).getTime() / 1000);
            const expTimestamp = Math.floor(new Date(expDate).getTime() / 1000);

            await contract.methods
                .createBatch(drugName, quantity, mfgTimestamp, expTimestamp)
                .send({ from: account });

            alert("Batch created successfully!");
            setIsOpen(false);
            setDrugName("");
            setQuantity("");
            setMfgDate("");
            setExpDate("");
        } catch (error) {
            console.error("Error creating batch:", error);
            alert("Failed to create batch.");
        }
    };

    async function fetchBatchStatusCounts() {
        if (!contract || !account) {
            alert("Connect Wallet first!");
            return;
        }

        try {
            const counts = await contract.methods.getBatchStatusCounts().call();
            const active = counts.active;
            const recalled = counts.recalled;
            const inTransit = counts.inTransit;

            setBatchCounts({ active, inTransit, recalled });
        } catch (error) {
            console.error("Error fetching batch status counts:", error);
        }
    }

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <aside className="w-64 h-screen sticky top-0 bg-white shadow-md">
                <SideBar sidebarItems={sidebarItems} />
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto w-full bg-teal-50">
                <div className=" p-16 flex flex-col items-start justify-between">
                    <div className="flex items-center justify-between px-10 mb-8 w-full">
                        <div className="bg-green-200 text-green-600 text-center p-6 w-64 rounded-xl shadow-sm">
                            <div className="text-4xl font-bold mb-2">
                                {batchCounts.active}
                            </div>
                            <div>ACTIVE BATCHES</div>
                        </div>
                        <div className="bg-blue-100 text-blue-600 text-center p-6 w-64 rounded-xl shadow-sm">
                            <div className="text-4xl font-bold mb-2">
                                {batchCounts.inTransit}
                            </div>
                            <div>BATCHES IN TRANSIT</div>
                        </div>
                        <div className="bg-red-200 text-red-600 text-center p-6 w-64 rounded-xl shadow-sm">
                            <div className="text-4xl font-bold">
                                {batchCounts.recalled}
                            </div>
                            <div>RECALLS</div>
                        </div>
                    </div>

                    <div className="w-full px-10 flex justify-around">
                        <div>
                            <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-96">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">Create New Batch</h2>
                                <form onSubmit={handleCreateBatch}>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 font-medium mb-2">Drug Name</label>
                                        <input
                                            type="text"
                                            value={drugName}
                                            onChange={(e) => setDrugName(e.target.value)}
                                            className="w-full p-2 border border-gray-300 text-gray-600 rounded-lg"
                                            placeholder="Enter Drug name"
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 font-medium mb-2">Quantity</label>
                                        <input
                                            type="number"
                                            value={quantity}
                                            onChange={(e) => setQuantity(e.target.value)}
                                            className="w-full p-2 border border-gray-300 text-gray-600 rounded-lg"
                                            placeholder="Enter quantity"
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 font-medium mb-2">Date of Manufacture</label>
                                        <input
                                            type="date"
                                            value={mfgDate}
                                            onChange={(e) => setMfgDate(e.target.value)}
                                            className="w-full p-2 border border-gray-300 text-gray-600 rounded-lg"
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 font-medium mb-2">Date of Expiry</label>
                                        <input
                                            type="date"
                                            value={expDate}
                                            onChange={(e) => setExpDate(e.target.value)}
                                            className="w-full p-2 border border-gray-300 text-gray-600 rounded-lg"
                                            required
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
                    </div>
                </div>
            </main>
        </div>
    );
}
