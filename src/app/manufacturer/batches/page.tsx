"use client";
import { useEffect, useState } from "react";
import SideBar from "@/component/SideBar";
import { loadContract } from "@/lib/contract";
import { Batch, BatchDetails, BatchStatus, statusMap } from "@/types/batchtypes";
import { sidebarItems } from "../page";
import { generateQRCode } from "@/app/regulator/page";

export default function Batches() {
   const [batches, setBatches] = useState<Batch[]>([]);
   const [account, setAccount] = useState<string | null>(null);
   const [contract, setContract] = useState<any>(null);
   const [selectedBatch, setSelectedBatch] = useState<BatchDetails | null>(null);
   const [isModalOpen, setIsModalOpen] = useState(false);
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
      <div className="flex h-screen">
         {/* Sidebar */}
         <aside className="w-64 h-screen sticky top-0 bg-white shadow-md">
            <SideBar sidebarItems={sidebarItems} />
         </aside>

         {/* Main Content */}
         <main className="flex-1 overflow-y-auto w-full bg-teal-50">
            <div className="max-w-7xl mx-auto w-11/12">
               <h1 className="text-xl text-black">Batches Page</h1>
               <hr className="text-gray-400" />
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

