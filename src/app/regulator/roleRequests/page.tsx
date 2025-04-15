"use client";

import { useEffect, useState } from "react";
import Web3 from "web3";
import SideBar from "@/component/SideBar";
import { MdDashboard, MdOutlineSettings } from "react-icons/md";
import { GoAlertFill } from "react-icons/go";
import { IoIosContacts } from "react-icons/io";
import { CONTRACT_ADDRESS } from "@/lib/contractConfig";
import { AbiItem } from "web3-utils";

// Import contract ABI properly
import contractJSON from "../../../../public/contract/PharmaSupplyChain.json";
const CONTRACT_ABI = contractJSON.abi as AbiItem[];

// Role mapping for display
const ROLE_NAMES: { [key: number]: string } = {
    0: "None",
    1: "Manufacturer",
    2: "Distributor",
    3: "Healthcare Provider",
    4: "Regulator"
};

interface RoleRequest {
    user: string;
    requestedRole: number;
}

export default function RoleRequests() {
    const [pendingRequests, setPendingRequests] = useState<RoleRequest[]>([]);
    const [web3, setWeb3] = useState<Web3 | null>(null);
    const [account, setAccount] = useState<string | null>(null);

    // Fixed sidebar routes for regulator
    const sidebarItems = [
        {
            icon: <MdDashboard size={32} />,
            text: "Dashboard",
            route: "/regulator",
        },
        {
            icon: <IoIosContacts size={38} />,
            text: "RoleRequests",
            route: "/regulator/roleRequests",
        },
        {
            icon: <GoAlertFill size={32} />,
            text: "Alerts",
            route: "/regulator/alerts", // Changed to regulator path
        },
        {
            icon: <MdOutlineSettings size={32} />,
            text: "Settings",
            route: "/regulator/settings", // Changed to regulator path
        },
    ];

    const loadContract = async () => {
        if (typeof window.ethereum === "undefined") {
            alert("Please install MetaMask to continue.");
            return null;
        }

        try {
            const web3Instance = new Web3(window.ethereum);
            setWeb3(web3Instance);

            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts"
            });
            setAccount(accounts[0]);

            return new web3Instance.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
        } catch (error) {
            console.error("Error loading contract:", error);
            alert("Failed to connect. Check MetaMask and try again.");
            return null;
        }
    };

    useEffect(() => {
        const loadPendingRequests = async () => {
            const contract = await loadContract();
            if (!contract || !account) return;

            try {
                // Call the correct contract method
                const requests: RoleRequest[] = await contract.methods
                    .getPendingRequestsWithRoles()
                    .call({ from: account });

                setPendingRequests(requests);
            } catch (error) {
                console.error("Error loading role requests:", error);
                alert("Failed to load requests. Are you the regulator?");
            }
        };

        loadPendingRequests();
    }, [account]);

    // Function to approve a role request
    const approveRequest = async (user: string) => {
        if (!web3 || !account) {
            alert("MetaMask is not connected. Please connect MetaMask.");
            return;
        }

        const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

        try {
            await contract.methods.approveRoleRequest(user).send({ from: account });
            alert(`Role request for ${user} approved successfully!`);

            // Refresh the pending requests after approval
            const updatedRequests: RoleRequest[] = await contract.methods
                .getPendingRequestsWithRoles()
                .call({ from: account });
            setPendingRequests(updatedRequests);
        } catch (error: any) {
            console.error("Error approving role request:", error);
            alert(`Failed to approve role request: ${error.message || error}`);
        }
    };

    // Function to approve a role request
    const denyRequest = async (user: string) => {
        if (!web3 || !account) {
            alert("MetaMask is not connected. Please connect MetaMask.");
            return;
        }

        const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

        try {
            await contract.methods.denyRoleRequest(user).send({ from: account });
            alert(`Role request for ${user} denyed successfully!`);

            // Refresh the pending requests after approval
            const updatedRequests: RoleRequest[] = await contract.methods
                .getPendingRequestsWithRoles()
                .call({ from: account });
            setPendingRequests(updatedRequests);
        } catch (error: any) {
            console.error("Error denying role request:", error);
            alert(`Failed to deny role request: ${error.message || error}`);
        }
    };

    return (
        <div className="w-full min-h-screen bg-white flex">
            <SideBar sidebarItems={sidebarItems} />

            <div className="flex-1 p-6 ml-10 mt-10 flex flex-col">
                <h3 className="text-[#15747c] text-3xl font-semibold mb-2">
                    Role Requests
                </h3>

                <div className="bg-green-100 rounded-md shadow-md w-10/12 p-4">
                    {pendingRequests.length === 0 ? (
                        <p className="text-gray-600">No pending role requests found.</p>
                    ) : (
                        <ul className="space-y-2">
                            {pendingRequests.map((request, index) => (
                                <li
                                    key={index}
                                    className="bg-white p-3 rounded shadow text-gray-700 border-l-4 border-[#15747c]"
                                >
                                    <div className="flex flex-col gap-1">
                                        <span><strong>Address:</strong> {request.user}</span>
                                        <span>
                                            <strong>Requested Role:</strong>{" "}
                                            {ROLE_NAMES[request.requestedRole] || "Unknown Role"}
                                        </span>
                                        <div className="flex gap-2 mt-2">
                                            <button
                                                onClick={() => approveRequest(request.user)}
                                                className="px-3.5 rounded-lg p-1 bg-green-400 text-white transition-transform duration-200 ease-in-out transform hover:scale-105 hover:cursor-pointer"
                                            >
                                                Approve
                                            </button>
                                            <button 
                                                onClick={() => denyRequest(request.user)}
                                                className="px-3.5 rounded-lg p-1 bg-red-400 text-white transition-transform duration-200 ease-in-out transform hover:scale-105 hover:cursor-pointer"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}