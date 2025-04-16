'use client';
import SideBar from "@/component/SideBar";
import { loadContract } from "@/lib/contract";
import { useEffect, useState } from "react";
import { FaUndo } from "react-icons/fa";
import { GiMedicinePills } from "react-icons/gi";
import { MdDashboard, MdOutlineSettings } from "react-icons/md";
import { TbTruckDelivery } from "react-icons/tb";

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

export default function Recall() {
    const [account, setAccount] = useState<string | null>(null);
    const [contract, setContract] = useState<any>(null);
    const [distributorAddress, setDistributorAddress] = useState('');
    const [batchID, setBatchID] = useState<string>(''); // Changed from undefined to an empty string
    const [loading, setLoading] = useState(false);
    const [batches, setBatches] = useState<Batch[]>([]);

    const sidebarItems = [
        { icon: <MdDashboard />, text: "Dashboard", route: "/manufacturer" },
        { icon: <GiMedicinePills />, text: "Batches", route: "/manufacturer/batches" },
        { icon: <TbTruckDelivery />, text: "Transfers", route: "/manufacturer/transfers" },
        { icon: <FaUndo />, text: "Recall", route: "/manufacturer/recall" },
        { icon: <MdOutlineSettings />, text: "Settings", route: "/manufacturer/settings" }
    ];

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
        setLoading(true);
        try {
            await contract.methods
                .recallBatch(Number(batchId))
                .send({ from: account });
            alert(`Batch ${batchId} Recalled successfully!`);
        } catch (error: any) {
            alert(`Recall failed: ${error.message || error}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex w-full bg-white">
            <SideBar sidebarItems={sidebarItems} />
            <div className="p-4 w-10/12">
                <h1 className="text-xl text-black">Recall Page</h1>
                <hr className="text-gray-400" />
                <div className="w-full flex items-center justify-center">
                    <form className="flex flex-col border-2 border-gray-600 rounded-lg p-7 my-12">
                        <h2 className="text-3xl font-bold mb-4 text-orange-600">Recall Batch</h2>
                        <label htmlFor="batchId" className="text-lg text-gray-700 mb-0.5">Batch ID</label>
                        <input
                            type="text"
                            value={batchID}
                            onChange={(e) => setBatchID(e.target.value)}
                            placeholder="Enter ID"
                            className="border border-gray-300 w-72 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3 text-gray-700"
                        />
                        <button
                            type="button"
                            onClick={() => recallBatch(batchID)}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            disabled={loading}
                        >
                            {loading ? 'Recalling...' : 'Reall Batch'}
                        </button>
                    </form>
                </div>
                <h2 className="text-2xl text-gray-600">Recalled Batches</h2>
                <div className="bg-white rounded-lg shadow-sm border overflow-x-auto">
                    <table className="w-full text-sm">
                        
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch ID</th>
                                <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry Date</th>
                                <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        
                        <tbody className="divide-y divide-gray-200">
                            {batches
                                .filter((batch) => batch.status === BatchStatus.Recalled)
                                .map((batch, index) => {
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
};