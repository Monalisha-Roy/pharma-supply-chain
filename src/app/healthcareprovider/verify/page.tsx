'use client';
import SideBar from "@/component/SideBar";
import { useEffect, useState } from "react";
import { loadContract } from "@/lib/contract";
import { Batch, BatchDetails, BatchStatus, statusMap } from "@/types/batchtypes";
import { sidebarItems } from "../page";
import BatchTable from "@/component/batchTable";


export default function healthcareVerify() {
    const [account, setAccount] = useState<string | null>(null);
    const [contract, setContract] = useState<any>(null);
    const [batchID, setBatchID] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [batches, setBatches] = useState<Batch[]>([]);
    const [selectedBatch, setSelectedBatch] = useState<BatchDetails | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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
    }, [contract, account, loading]);

    const verifyBatch = async (batchId: string) => {
        if (!contract || !account) return alert("Please connect MetaMask.");
        setLoading(true);
        try {
            await contract.methods
                .verifyBatch(Number(batchId))
                .send({ from: account });
            alert(`Batch ${batchId} Vefified successfully!`);
        } catch (error: any) {
            alert(`Verification failed: ${error.message || error}`);
        } finally {
            setLoading(false);
        }
    };

    const openModal = async (batchID: number) => {
        if (!contract || !account) return alert("Connect Wallet first!");

        try {
            const details = await contract.methods.getBatchDetails(batchID).call({ from: account });
            setSelectedBatch({
                batchID: batchID,
                drugName: details[0],
                quantity: Number(details[1]),
                manufacturingDate: new Date(Number(details[2]) * 1000).toLocaleDateString(),
                expiryDate: new Date(Number(details[3]) * 1000).toLocaleDateString(),
                status: details[4].toString(),
                manufacturer: details[5],
                distributor: details[6],
                healthcareProvider: details[7],
            });
            setIsModalOpen(true);
        } catch (error: any) {
            alert("Failed to fetch batch details: " + (error.message || error));
        }
    };

    const closeModal = () => {
        setSelectedBatch(null);
        setIsModalOpen(false);
    };

    return (
        <div className="flex h-screen w-screen overflow-hidden">
            {/* Sidebar */}
            <aside className="w-1/5 h-screen bg-teal-50 shadow-md">
                <SideBar sidebarItems={sidebarItems} />
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-teal-50 py-6">
                <h1 className="text-xl text-black">Verification</h1>
                <hr className="text-gray-400 mb-6" />
                <div className="flex justify-center">
                    <form className="flex flex-col border-2 border-gray-600 rounded-lg p-7 my-12">
                        <h2 className="text-3xl font-bold mb-4 text-green-600">Verify Batch</h2>
                        <label htmlFor="batchId" className="text-lg text-gray-700 mb-0.5">Batch ID</label>
                        <input
                            type="text"
                            value={batchID}
                            onChange={(e) => setBatchID(e.target.value)}
                            placeholder="Enter ID"
                            className="border border-gray-300 w-72 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3 text-gray-700"
                        />
                        <button
                            className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 hover:cursor-pointer"
                            onClick={(e) => {
                                e.preventDefault();
                                if (batchID) {
                                    openModal(Number(batchID));
                                } else {
                                    alert("Please enter a valid Batch ID.");
                                }
                            }}
                        >
                            Check Details
                        </button>

                    </form>
                </div>

                <div className="w-full px-10">
                    <h2 className="text-2xl text-gray-600 mt-12 mb-4">Verified Batches</h2>
                    <BatchTable status={BatchStatus.Verified}/>
                </div>
            </main>
        </div>
    );
}


{/* <button
    type="button"
    onClick={() => recallBatch(batchID)}
    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
    disabled={loading}
>
    {loading ? 'Recalling...' : 'Reall Batch'}
</button> */}