// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// BaseContract.sol
contract BaseContract {
    enum Role {
        None,
        Manufacturer,
        Distributor,
        HealthcareProvider,
        Regulator
    }
    
    enum Status {
        Created,
        InTransit,
        Delivered,
        Verified,
        Recalled
    }

    struct Batch {
        uint batchID;
        string drugName;
        uint quantity;
        uint manufacturingDate;
        uint expiryDate;
        address payable manufacturer;
        address payable distributor;
        address payable healthcareProvider;
        Status status;
    }

    struct RoleRequest {
        Role requestedRole;
        bool exists;
        bool approved;
        bool processed;
    }

    struct PendingRequest {
        address user;
        Role requestedRole;
    }

    struct BatchSummary {
        uint batchID;
        Status status;
        uint expiryDate;
    }

    address payable public regulator;
    uint public nextBatchID;
    mapping(address => Role) public userRoles;
    mapping(uint => Batch) public batches;
    mapping(address => RoleRequest) public roleRequests;
    address[] public pendingRequests;
    mapping(address => uint) internal requestIndices;
    mapping(uint => uint) public batchStatusTimestamps;
    mapping(uint => address[]) public batchHistory;

    event RoleAssigned(address indexed user, Role role);
    event BatchCreated(
        uint batchID,
        string drugName,
        uint quantity,
        uint manufacturingDate,
        uint expiryDate,
        address manufacturer
    );
    event BatchTransferred(uint batchID, address to, Status status);
    event BatchVerified(uint batchID, address healthcareProvider);
    event BatchRecalled(uint batchID, address recalledBy);
    event ExpirationAlert(
        uint indexed batchID,
        bool isExpired,
        uint daysRemaining
    );
    event RoleRequested(address indexed user, Role requestedRole);
    event RoleApproved(address indexed user, Role role);
    event RoleDenied(address indexed user, Role role);

    modifier onlyRole(Role requiredRole) {
        require(
            userRoles[msg.sender] == requiredRole,
            "Not authorized for this action"
        );
        _;
    }

    modifier onlyRegulator() {
        require(msg.sender == regulator, "Only regulator can perform this action");
        _;
    }

    modifier batchExists(uint batchID) {
        require(batches[batchID].batchID == batchID, "Batch does not exist");
        _;
    }

    modifier onlyBatchAuthorized(uint batchID) {
        Batch memory batch = batches[batchID];
        require(
            msg.sender == regulator ||
                msg.sender == batch.manufacturer ||
                msg.sender == batch.healthcareProvider,
            "Not authorized for batch alerts"
        );
        _;
    }
}
