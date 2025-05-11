'use client'
import SideBar from "@/component/SideBar";
import { MdDashboard, MdOutlineSettings } from "react-icons/md";
import { GoAlertFill } from "react-icons/go";
import { IoIosContacts } from "react-icons/io";
import { useEffect, useState } from "react";
import { loadContract } from "@/lib/contract";
import { Batch, BatchDetails, BatchStatus, statusMap } from "@/types/batchtypes";
import QRCode from "qrcode";

export const sidebarItems = [
    { icon: <MdDashboard size={32} />, text: "Dashboard", route: "/regulator" },
    { icon: <IoIosContacts size={38} />, text: "RoleRequests", route: "/regulator/roleRequests" },
    { icon: <GoAlertFill size={32} />, text: "Alerts", route: "/regulator/alerts" },
    { icon: <MdOutlineSettings size={32} />, text: "Settings", route: "/regulator/settings" }
];
export const generateQRCode = async (batchData: any) => {
    try {
        const qrData = await QRCode.toDataURL(JSON.stringify(batchData));
        return qrData;
    } catch (error) {
        console.error("Error generating QR Code:", error);
        return undefined;
    }
};

export default function Regulator() {
    const [account, setAccount] = useState<string | null>(null);
    const [contract, setContract] = useState<any>(null);
    const [batchCounts, setBatchCounts] = useState({
        active: 0,
        inTransit: 0,
        recalled: 0,
    });
    const [batches, setBatches] = useState<Batch[]>([]);
    const [selectedBatch, setSelectedBatch] = useState<BatchDetails | null>(null); // Use ExtendedBatchDetails
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const generateQRCode = async (batchData: any) => {
        try {
            const qrData = await QRCode.toDataURL(JSON.stringify(batchData));
            return qrData;
        } catch (error) {
            console.error("Error generating QR Code:", error);
            return undefined;
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

            const qrCode = await generateQRCode(batchData); // Update QR code for the batch
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
        <div className="w-full min-h-screen bg-white flex">
            {/* Sidebar */}
            <aside className="w-64 h-screen sticky top-0 bg-white shadow-md">
                <SideBar sidebarItems={sidebarItems} />
            </aside>
            {/* Main Content */}
            <main className="flex-1 overflow-y-auto w-full bg-teal-50">
                <div className="px-16 pt-16 flex flex-col items-start justify-between">
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
                </div>

                <div className="w-10/12 mx-auto">
                    <h2 className="text-3xl font-gold text-gray-700 mt-10 mb-2">All Batches</h2>
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
                                                <button
                                                    onClick={() => openModal(batch.batchId)}
                                                    className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                                                    View
                                                </button>
                                                {isModalOpen && selectedBatch && (
                                                    <div className="fixed inset-0 flex items-center justify-center z-50">
                                                        <div className="bg-[#dff9fb] rounded-xl p-6 w-full max-w-lg relative shadow-md">
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
