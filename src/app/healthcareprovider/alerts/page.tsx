'use client';
import { loadContract } from "@/lib/contract";
import { Batch } from "@/types/batchtypes";
import { useEffect, useState } from "react";
import { sidebarItems } from "../page";
import SideBar from "@/component/SideBar";

export default function Alerts() {
    const [account, setAccount] = useState<string | null>(null);
    const [contract, setContract] = useState<any>(null);
    const [batches, setBatches] = useState<Batch[]>([]);
    const [batchID, setBatchID] = useState<string>(''); // Changed from undefined to an empty string
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
            expiryDate: new Date(Number(batch[2]) * 1000).toISOString(), // Keep ISO for calculations
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

    const getDaysUntilExpiry = (expiryDate: string): number => {
        const today = new Date();
        const expiry = new Date(expiryDate);
        const timeDiff = expiry.getTime() - today.getTime();
        return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    };

    const renderAlerts = () => {
        return batches
            .map((batch) => {
                const daysLeft = getDaysUntilExpiry(batch.expiryDate);
                if (daysLeft < 0) {
                    return (
                        <div
                            key={batch.batchId}
                            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-4 shadow"
                        >
                            ⚠️ <strong>Batch {batch.batchId}</strong> has <strong>EXPIRED</strong>!
                        </div>
                    );
                } else if (daysLeft <= 7) {
                    return (
                        <div
                            key={batch.batchId}
                            className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded mb-4 shadow"
                        >
                            ⏳ <strong>Batch {batch.batchId}</strong> will expire in <strong>{daysLeft} day(s)</strong>.
                        </div>
                    );
                } else {
                    return null;
                }
            })
            .filter(Boolean); // Filter out nulls
    };

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
        <div className="flex h-screen w-screen overflow-hidden">
            {/* Sidebar */}
            <aside className="w-1/5 h-screen bg-teal-50 shadow-md">
                <SideBar sidebarItems={sidebarItems} />
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-teal-50 py-6 px-8">
                <h1 className="text-2xl font-semibold text-gray-800 mb-4">📢 Expiry Alerts</h1>
                <hr className="text-gray-400 mb-6" />
                {renderAlerts().length === 0 ? (
                    <p className="text-gray-500">No upcoming expiries or expired batches.</p>
                ) : (
                    renderAlerts()
                )}
                <div className="w-full flex items-center justify-center ">
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
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                            disabled={loading}
                        >
                            {loading ? 'Recalling...' : 'Reall Batch'}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}
