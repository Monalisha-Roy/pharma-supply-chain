// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./baseControl.sol";

contract RoleManager is BaseContract {
    function requestRole(Role requestedRole) public {
        require(userRoles[msg.sender] == Role.None, "Already has a role");
        require(
            requestedRole != Role.Regulator,
            "Cannot request Regulator role"
        );
        require(
            !roleRequests[msg.sender].exists ||
                roleRequests[msg.sender].processed,
            "Request already pending"
        );

        roleRequests[msg.sender] = RoleRequest({
            requestedRole: requestedRole,
            exists: true,
            approved: false,
            processed: false
        });

        pendingRequests.push(msg.sender);
        requestIndices[msg.sender] = pendingRequests.length - 1;
        emit RoleRequested(msg.sender, requestedRole);
    }

    function approveRoleRequest(address user) public onlyRegulator {
        require(roleRequests[user].exists, "No request found");
        require(!roleRequests[user].processed, "Request already processed");
        require(
            roleRequests[user].requestedRole != Role.Regulator,
            "Cannot assign Regulator role"
        );

        Role requestedRole = roleRequests[user].requestedRole;
        userRoles[user] = requestedRole;
        roleRequests[user].approved = true;
        roleRequests[user].processed = true;

        uint idx = requestIndices[user];
        address last = pendingRequests[pendingRequests.length - 1];
        pendingRequests[idx] = last;
        requestIndices[last] = idx;
        pendingRequests.pop();
        delete requestIndices[user];

        emit RoleApproved(user, requestedRole);
        emit RoleAssigned(user, requestedRole);
    }

    function denyRoleRequest(address user) public onlyRegulator {
        require(roleRequests[user].exists, "No request found");
        require(!roleRequests[user].processed, "Request already processed");

        roleRequests[user].processed = true;

        uint idx = requestIndices[user];
        address last = pendingRequests[pendingRequests.length - 1];
        pendingRequests[idx] = last;
        requestIndices[last] = idx;
        pendingRequests.pop();
        delete requestIndices[user];

        emit RoleDenied(user, roleRequests[user].requestedRole);
    }

    function getPendingRequests() public view onlyRegulator returns (address[] memory) {
        return pendingRequests;
    }

    function getRequestStatus(address user) public view returns (RoleRequest memory) {
        return roleRequests[user];
    }

    function getPendingRequestsWithRoles() public view onlyRegulator returns (PendingRequest[] memory) {
        PendingRequest[] memory requests = new PendingRequest[](pendingRequests.length);

        for (uint i = 0; i < pendingRequests.length; i++) {
            address user = pendingRequests[i];
            requests[i] = PendingRequest({
                user: user,
                requestedRole: roleRequests[user].requestedRole
            });
        }

        return requests;
    }
}
