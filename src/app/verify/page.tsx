"use client";
import Navbar from "@/component/navbar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { BsQrCode } from "react-icons/bs";
import { MdOutlineCloudUpload } from "react-icons/md";
import { loadContract } from "@/lib/contract";
import { BatchDetails, BatchStatus, statusMap } from "@/types/batchtypes";
import { BrowserQRCodeReader } from '@zxing/browser';

export default function Verify() {
  const router = useRouter();
  const [verificationId, setVerificationId] = useState("");
  const [batchDetails, setBatchDetails] = useState<any | null>(null);
  const [qrFileName, setQrFileName] = useState<string | null>(null);
  const [qrData, setQrData] = useState<string | null>(null);
  const [contract, setContract] = useState<any>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<BatchDetails | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const initializeContract = async () => {
      const { contract, account } = await loadContract();
      if(!contract || !account) alert("Connect to a Wallet!");
      setContract(contract);
      setAccount(account);
    };
    initializeContract();
  }, []);

  const handleSubmit = async () => {
    if (!verificationId) {
      alert("Please enter a Batch ID");
      return;
    }

    const batchID = Number(verificationId);
    if (isNaN(batchID)) {
      alert("Invalid Batch ID");
      return;
    }

    try {
      const details = await contract.methods.getBatchDetails(batchID).call();
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
    } catch (error) {
      if (error instanceof Error) {
        alert("Failed to fetch batch details: " + error.message);
      } else {
        alert("Failed to fetch batch details: An unknown error occurred");
      }
    }
  };


  const handleQrUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setQrFileName(file.name);

    try {
      const codeReader = new BrowserQRCodeReader();
      const result = await codeReader.decodeFromImageUrl(URL.createObjectURL(file));
      setQrData(result.getText());

      // Optional: If you want to automatically verify the QR content as batch ID
      const qrBatchId = Number(result.getText());
      // if (!isNaN(qrBatchId)) {
      //   handleSubmit(qrBatchId);
      // }
    } catch (error) {
      alert("Failed to decode QR code or invalid QR content");
    }
  };


  return (
    <div className="w-full min-h-screen relative">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={"/verifyBg.jpg"}
          alt={"background image"}
          fill
          style={{ objectFit: "cover" }}
          className="brightness-40"
          priority
        />
      </div>

      {/* Content Wrapper */}
      <div className="relative z-10">
        <Navbar />

        {/* Main Content */}
        <div className="flex flex-col items-center justify-center min-h-screen py-24 px-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-12 w-full max-w-6xl">
            {/* Verification ID Section */}
            <div className="bg-white bg-opacity-90 p-10 rounded-2xl shadow-xl flex flex-col items-center space-y-8 w-full md:w-1/2 h-[525px]">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-gray-800">
                  Verify with Batch ID
                </h2>
                <p className="text-gray-600">Enter your Batch ID</p>
              </div>

              <div className="w-full space-y-6 text-gray-500">
                <input
                  type="text"
                  placeholder="e.g. 1234567890"
                  className="p-4 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-[#0cc0cf] focus:border-transparent text-lg"
                  value={verificationId}
                  onChange={(e) => setVerificationId(e.target.value)}
                />
                <button
                  onClick={handleSubmit}
                  className="p-4 bg-[#0cc0cf] text-white rounded-lg hover:bg-[#0aa8b8] transition-all duration-300 shadow-md w-full font-medium text-lg"
                >
                  Verify Product
                </button>
              </div>

              {isModalOpen && selectedBatch && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
                  <div className="bg-white text-black p-8 rounded-lg max-w-md w-full">
                    <h2 className="text-2xl font-bold mb-4">Batch Details</h2>
                    <div className="space-y-2">
                      <p><strong>Drug Name:</strong> {selectedBatch.drugName}</p>
                      <p><strong>Quantity:</strong> {selectedBatch.quantity}</p>
                      <p><strong>Manufacturing Date:</strong> {selectedBatch.manufacturingDate}</p>
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
                    </div>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="mt-4 bg-[#0cc0cf] text-white px-4 py-2 rounded hover:bg-[#0aa8b8]"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-auto text-center text-gray-500 text-sm">
                <p>Find the Batch ID on your product packaging</p>
              </div>
            </div>

            {/* QR Code Section */}
            <div className="bg-white bg-opacity-90 p-10 rounded-2xl shadow-xl flex flex-col items-center space-y-8 w-full md:w-1/2 h-[525px]">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-gray-800">
                  Scan QR Code
                </h2>
                <p className="text-gray-600">Upload product QR from device</p>
              </div>

              <div className="flex items-center justify-center bg-gray-100 p-10 rounded-lg ">
                <BsQrCode className="text-gray-400 w-40 h-40" />
              </div>

              <div className="w-full space-y-4">
                <label className="block">
                  <span className="sr-only">Choose QR image</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="qr-upload"
                    onChange={handleQrUpload}
                  />
                  {qrFileName && (
                    <p className="text-sm text-gray-600 text-center">
                      Selected File: <strong>{qrFileName}</strong>
                    </p>
                  )}
                  <label
                    htmlFor="qr-upload"
                    className="p-4 bg-[#0cc0cf] text-white rounded-lg hover:bg-[#0aa8b8] transition-all duration-300 shadow-md w-full font-medium text-lg text-center cursor-pointer flex items-center justify-center gap-2"
                  >
                    <MdOutlineCloudUpload size={28} />
                    <span>Upload QR Image</span>
                  </label>
                </label>
              </div>

              {qrData && (
                <div className="mt-4 text-gray-700 text-center">
                  <h3 className="text-xl font-bold mb-2">QR Code Data</h3>
                  <div className="bg-gray-100 p-4 rounded-lg break-words">
                    {qrData}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
