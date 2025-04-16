import SideBar from "@/component/SideBar";
import { MdDashboard, MdOutlineSettings } from "react-icons/md";
import { TbTruckDelivery } from "react-icons/tb";
import { GoAlertFill } from "react-icons/go";
import { useEffect, useState } from "react";
import { loadContract } from "@/lib/contract";

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

const statusMap: Record<BatchStatus, { label: string; color: string }> = {
    [BatchStatus.Created]: { label: "Created", color: "bg-yellow-100 text-yellow-800" },
    [BatchStatus.InTransit]: { label: "In Transit", color: "bg-orange-100 text-orange-800" },
    [BatchStatus.Delivered]: { label: "Delivered", color: "bg-blue-100 text-blue-800" },
    [BatchStatus.Verified]: { label: "Verified", color: "bg-green-100 text-green-800" },
    [BatchStatus.Recalled]: { label: "Recalled", color: "bg-red-100 text-red-800" }
};


export default function Manufacturer() {
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
            <div className="max-w-7xl mx-auto p-4 w-10/12">
                <h1 className="text-xl text-black">Dashboard</h1>
                <hr className="text-gray-400" />  
                

                <h2 className="text-3xl font-gold text-gray-700 mt-10 mb-2">All Batches</h2>
                <div className="bg-white rounded-lg shadow-sm border overflow-x-auto ">
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
