"use client";

import { useEffect, useState } from "react";
import { FaUndo } from "react-icons/fa";
import { GiMedicinePills } from "react-icons/gi";
import { MdDashboard, MdOutlineSettings } from "react-icons/md";
import { TbTruckDelivery } from "react-icons/tb";
import SideBar from "@/component/SideBar";
import { loadContract } from "@/lib/contract";

// Batch status enum
enum BatchStatus {
    Created = "0",
    InTransit = "1",
    Delivered = "2",
    Verified = "3",
    Recalled = "4"
}

interface Batch {
    batchId: number;
    status: BatchStatus;
    expiryDate: string;
}

const sidebarItems = [
    { icon: <MdDashboard />, text: "Dashboard", route: "/manufacturer" },
    { icon: <GiMedicinePills />, text: "Batches", route: "/manufacturer/batches" },
    { icon: <TbTruckDelivery />, text: "Transfers", route: "/manufacturer/transfers" },
    { icon: <FaUndo />, text: "Recall", route: "/manufacturer/recall" },
    { icon: <MdOutlineSettings />, text: "Settings", route: "/manufacturer/settings" }
];

const statusMap: Record<BatchStatus, { label: string; color: string }> = {
    [BatchStatus.Created]: { label: "Created", color: "bg-yellow-100 text-yellow-800" },
    [BatchStatus.InTransit]: { label: "In Transit", color: "bg-orange-100 text-orange-800" },
    [BatchStatus.Delivered]: { label: "Delivered", color: "bg-blue-100 text-blue-800" },
    [BatchStatus.Verified]: { label: "Verified", color: "bg-green-100 text-green-800" },
    [BatchStatus.Recalled]: { label: "Recalled", color: "bg-red-100 text-red-800" }
};

export default function Batches() {
    const [batches, setBatches] = useState<Batch[]>([]);
    const [account, setAccount] = useState<string | null>(null);
    const [contract, setContract] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const initializeContract = async () => {
            const { contract, account } = await loadContract();
            setContract(contract);
            setAccount(account);
        };
        initializeContract();
    }, []);

    const formatBatches = (data: any[]): Batch[] => {
        return data.map((batch) => ({
            batchId: Number(batch[0]),
            status: batch[1].toString(),
            expiryDate: new Date(Number(batch[2]) * 1000).toLocaleDateString(),
        }));
    };

    useEffect(() => {
        const fetchBatches = async () => {
            if (!contract || !account) return;
            try {
                const fetchedBatches = await contract.methods.getAllBatchesWithStatus().call({ from: account });
                setBatches(formatBatches(fetchedBatches));
            } catch (error) {
                console.error("Error fetching batches:", error);
            }
        };
        fetchBatches();
    }, [contract, account]);

    const recallBatch = async (batchId: string) => {
        if (!contract || !account) return alert("Please connect MetaMask.");
        try {
            await contract.methods.recallBatch(batchId).send({ from: account });
            const updated = await contract.methods.getAllBatchesWithStatus().call({ from: account });
            setBatches(formatBatches(updated));
            alert(`Batch ${batchId} recalled successfully!`);
        } catch (error: any) {
            alert(`Recall failed: ${error.message || error}`);
        }
    };

    

    return (
        <div className="flex bg-white">
            <SideBar sidebarItems={sidebarItems} />
            <div className="max-w-7xl mx-auto p-8 w-full">

                <div className="bg-white rounded-lg shadow-sm border overflow-x-auto">
                    <table className="w-full text-sm">
                        {/* Table header remains same */}
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch ID</th>
                                <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry Date</th>
                                <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        
                        <tbody className="divide-y divide-gray-200">
                            {batches.map((batch, index) => {
                                const status = statusMap[batch.status as BatchStatus];
                                return (
                                    <tr key={index}>
                                        <td className="px-8 py-4 text-sm text-gray-900">{batch.batchId}</td>
                                        <td className="px-8 py-4">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${status.color}`}>
                                                {status.label}
                                            </span>
                                        </td>
                                        <td className="px-8 py-4 text-sm text-gray-500">
                                            {batch.expiryDate || "N/A"}
                                        </td>
                                        <td className="px-8 py-4 space-x-2">
                                            {/* {batch.status === BatchStatus.InTransit && (
                                                <button
                                                    onClick={() => recallBatch(batch.batchId.toString())}
                                                    className="text-red-600 hover:text-red-900 text-sm font-medium"
                                                >
                                                    Recall
                                                </button>
                                            )}
                                            {batch.status === BatchStatus.Created && (
                                                <button
                                                    onClick={() => transferToDistributor(batch.batchId.toString())}
                                                    disabled={loading}
                                                    className={`text-blue-600 hover:text-blue-900 text-sm font-medium ${
                                                        loading ? 'opacity-50 cursor-not-allowed' : ''
                                                    }`}
                                                >
                                                    {loading ? 'Transferring...' : 'Transfer'}
                                                </button>
                                            )} */}
                                            <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}