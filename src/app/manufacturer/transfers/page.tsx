'use client';
import SideBar from "@/component/SideBar";
import { loadContract } from "@/lib/contract";
import { useEffect, useState } from "react";
import { sidebarItems } from "../page";
import { Batch, BatchDetails, BatchStatus, statusMap } from "@/types/batchtypes";
import { generateQRCode } from "@/app/regulator/page";

export default function Transfers() {
    const [account, setAccount] = useState<string | null>(null);
    const [contract, setContract] = useState<any>(null);
    const [distributorAddress, setDistributorAddress] = useState('');
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

    const transferToDistributor = async (batchId: string, distributorAddress: string) => {
        if (!contract || !account) return alert("Please connect MetaMask.");
        if (!distributorAddress) return alert("Please enter distributor address");
        if (!/^0x[a-fA-F0-9]{40}$/.test(distributorAddress)) return alert("Invalid Ethereum address");

        setLoading(true);
        try {
            await contract.methods
                .transferToDistributor(Number(batchId), distributorAddress)
                .send({ from: account });
            alert(`Batch ${batchId} transferred successfully!`);
            setDistributorAddress('');
        } catch (error: any) {
            alert(`Transfer failed: ${error.message || error}`);
        } finally {
            setLoading(false);
        }
    };

    const openModal = async (batchID: number) => {
        if (!contract || !account) return alert("Connect Wallet first!");
  
        try {
           const details = await contract.methods.getBatchDetails(batchID).call({ from: account });
           const batchData = {
              batchID: batchID,
              drugName: details[0],
              quantity: Number(details[1]),
              manufacturingDate: new Date(Number(details[2]) * 1000).toLocaleDateString(),
              expiryDate: new Date(Number(details[3]) * 1000).toLocaleDateString(),
              status: details[4].toString(),
              manufacturer: details[5],
              distributor: details[6],
              healthcareProvider: details[7],
           };
  
           const qrCode = await generateQRCode(batchData);
           setSelectedBatch({ ...batchData, qrCode }); // Store updated QR code with batch details
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
                <h1 className="text-xl text-black">Transfers Page</h1>
                <hr className="text-gray-400 mb-6" />
                <div className="flex justify-center">
                    <form className="flex flex-col border-2 border-gray-600 rounded-lg p-12 w-full max-w-lg bg-white shadow-md">
                        <h2 className="text-3xl font-bold mb-4 text-gray-600">Transfer to Distributor</h2>
                        <label htmlFor="batchId" className="text-lg text-gray-700 mb-0.5">Batch ID</label>
                        <input
                            type="text"
                            value={batchID}
                            onChange={(e) => setBatchID(e.target.value)}
                            placeholder="Enter ID"
                            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3 text-gray-700"
                        />
                        <label htmlFor="batchId" className="text-lg text-gray-700 mb-0.5">Distributor Address</label>
                        <input
                            type="text"
                            value={distributorAddress}
                            onChange={(e) => setDistributorAddress(e.target.value)}
                            placeholder="Distributor Ethereum Address (0x...)"
                            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 text-gray-700"
                        />
                        <button
                            type="button"
                            onClick={() => transferToDistributor(batchID || '', distributorAddress)}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            disabled={loading}
                        >
                            {loading ? 'Transferring...' : 'Transfer'}
                        </button>
                    </form>
                </div>

                <div className="w-full px-10">
                    <h2 className="text-2xl text-gray-600 mt-12 mb-4">Transferred Batches</h2>
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
                                    .filter((batch) => batch.status === BatchStatus.InTransit)
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
                                                    <button
                                                        onClick={() => openModal(batch.batchId)}
                                                        className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                                                        View
                                                    </button>
                                                    {isModalOpen && selectedBatch && (
                                                        <div className="fixed inset-0 z-50 flex items-center justify-center ">
                                                            <div className="bg-[#dff9fb] rounded-xl p-6 w-full max-w-lg relative shadow-lg border-4 border-[#2ebfd6]">
                                                                <button
                                                                    className="absolute top-3 right-3 text-gray-600 hover:text-red-500"
                                                                    onClick={closeModal}
                                                                >
                                                                    ✕
                                                                </button>
                                                                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Batch Details</h2>
                                                                <div className="space-y-2 text-gray-700">
                                                                    <p><strong>Batch ID:</strong> {selectedBatch.batchID}</p>
                                                                    <p><strong>Drug Name:</strong> {selectedBatch.drugName}</p>
                                                                    <p><strong>Quantity:</strong> {selectedBatch.quantity}</p>
                                                                    <p><strong>Manufactured On:</strong> {selectedBatch.manufacturingDate}</p>
                                                                    <p><strong>Expiry Date:</strong> {selectedBatch.expiryDate}</p>
                                                                    <p>
                                                                        <strong>Status:</strong>{" "}
                                                                        <span className={`font-semibold px-2 text-sm rounded-full ${statusMap[selectedBatch.status as BatchStatus]?.color}`}>
                                                                            {statusMap[selectedBatch.status as BatchStatus]?.label}
                                                                        </span>
                                                                    </p>
                                                                    <p><strong>Manufacturer:</strong> {selectedBatch.manufacturer}</p>
                                                                    <p><strong>Distributor:</strong> {selectedBatch.distributor}</p>
                                                                    <p><strong>Healthcare Provider:</strong> {selectedBatch.healthcareProvider}</p>
                                                                    {selectedBatch.qrCode && (
                                                                        <div className="mt-4">
                                                                            <p><strong>QR Code:</strong></p>
                                                                            <img src={selectedBatch.qrCode} alt="Batch QR Code" className="w-32 h-32" />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
