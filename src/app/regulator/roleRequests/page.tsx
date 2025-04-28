"use client";

import { useEffect, useState } from "react";
import SideBar from "@/component/SideBar";
import { loadContract } from "@/lib/contract";
import { sidebarItems } from "../page";

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
    const [account, setAccount] = useState<string | null>(null);
    const [contract, setContract] = useState<any>(null);

    useEffect(() => {
        const initializeContract = async () => {
            const { contract, account } = await loadContract();
            setContract(contract);
            setAccount(account);
        };

        initializeContract();
    }, []);

    useEffect(() => {
        const loadPendingRequests = async () => {
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
    }, [contract, account]);

    // Function to approve a role request
    const approveRequest = async (user: string) => {
        if (!contract || !account) {
            alert("MetaMask is not connected. Please connect MetaMask.");
            return;
        }

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

    // Function to deny a role request
    const denyRequest = async (user: string) => {
        if (!contract || !account) {
            alert("MetaMask is not connected. Please connect MetaMask.");
            return;
        }

        try {
            await contract.methods.denyRoleRequest(user).send({ from: account });
            alert(`Role request for ${user} denied successfully!`);

            // Refresh the pending requests after denial
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
            {/* Sidebar */}
            <aside className="w-64 h-screen sticky top-0 bg-white shadow-md">
                <SideBar sidebarItems={sidebarItems} />
            </aside>
            {/* Main Content */}
            <main className="flex-1 overflow-y-auto w-full bg-teal-50">
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
            </main>
        </div>
    );
}
