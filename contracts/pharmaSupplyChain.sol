// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PharmaSupplyChain {
    // Role Definitions
    enum Role { None, Manufacturer, Distributor, HealthcareProvider, Regulator }
    enum Status { Created, InTransit, Delivered, Verified, Recalled }

    struct Batch {
        uint batchID;
        string drugName;
        uint quantity;
        uint manufacturingDate; 
        uint expiryDate;
        address manufacturer;
        address distributor;
        address healthcareProvider;
        Status status;
    }

    struct RoleRequest {
        Role requestedRole;
        bool exists;
        bool approved;
        bool processed;
    }

    // State Variables
    address public regulator;
    uint public nextBatchID;
    mapping(address => Role) public userRoles;
    mapping(uint => Batch) public batches;
    mapping(address => RoleRequest) public roleRequests;
    address[] public pendingRequests;
    mapping(address => uint) private requestIndices;

    // Events
    event RoleAssigned(address indexed user, Role role);
    event BatchCreated(uint batchID, string drugName, uint quantity, uint manufacturingDate, uint expiryDate, address manufacturer);
    event BatchTransferred(uint batchID, address to, Status status);
    event BatchVerified(uint batchID, address healthcareProvider);
    event BatchRecalled(uint batchID, address recalledBy);
    event ExpirationAlert(uint indexed batchID, bool isExpired, uint daysRemaining);
    event RoleRequested(address indexed user, Role requestedRole);
    event RoleApproved(address indexed user, Role role);
    event RoleDenied(address indexed user, Role role);

    // Modifiers
    modifier onlyRole(Role requiredRole) {
        require(userRoles[msg.sender] == requiredRole, "Not authorized for this action");
        _;
    }

    modifier onlyRegulator() {
        require(msg.sender == regulator, "Only regulator can assign roles");
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

    // Constructor
    constructor() {
        regulator = msg.sender;
        userRoles[msg.sender] = Role.Regulator;
        nextBatchID = 1;
        emit RoleAssigned(msg.sender, Role.Regulator);
    }

    // Role Management Functions
    function requestRole(Role requestedRole) public {
        require(userRoles[msg.sender] == Role.None, "Already has a role");
        require(requestedRole != Role.Regulator, "Cannot request Regulator role");
        require(!roleRequests[msg.sender].exists || roleRequests[msg.sender].processed, "Request already pending");

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
        require(roleRequests[user].requestedRole != Role.Regulator, "Cannot assign Regulator role");

        Role requestedRole = roleRequests[user].requestedRole;
        userRoles[user] = requestedRole;
        roleRequests[user].approved = true;
        roleRequests[user].processed = true;

        // Efficient removal using swap-and-pop
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

        // Efficient removal using swap-and-pop
        uint idx = requestIndices[user];
        address last = pendingRequests[pendingRequests.length - 1];
        pendingRequests[idx] = last;
        requestIndices[last] = idx;
        pendingRequests.pop();
        delete requestIndices[user];

        emit RoleDenied(user, roleRequests[user].requestedRole);
    }

    // Batch Lifecycle Functions
    function createBatch(
        string memory drugName,
        uint quantity,
        uint manufacturingDate,
        uint expiryDate
    ) public onlyRole(Role.Manufacturer) {
        require(bytes(drugName).length > 0, "Drug name required");
        require(manufacturingDate < expiryDate, "Invalid manufacturing/expiry date");
        require(manufacturingDate <= block.timestamp, "Manufacturing date cannot be in the future");

        batches[nextBatchID] = Batch({
            batchID: nextBatchID,
            drugName: drugName,
            quantity: quantity,
            manufacturingDate: manufacturingDate,
            expiryDate: expiryDate,
            manufacturer: msg.sender,
            distributor: address(0),
            healthcareProvider: address(0),
            status: Status.Created
        });

        emit BatchCreated(nextBatchID, drugName, quantity, manufacturingDate, expiryDate, msg.sender);
        nextBatchID++;
    }

    function transferToDistributor(uint batchID, address distributor)
        public
        onlyRole(Role.Manufacturer)
        batchExists(batchID)
    {
        require(userRoles[distributor] == Role.Distributor, "Invalid distributor");
        require(batches[batchID].status == Status.Created, "Batch not ready for transfer");
        require(batches[batchID].expiryDate > block.timestamp, "Batch expired");
        
        batches[batchID].distributor = distributor;
        batches[batchID].status = Status.InTransit;
        emit BatchTransferred(batchID, distributor, Status.InTransit);
    }

    function transferToHealthcare(uint batchID, address healthcareProvider)
        public
        onlyRole(Role.Distributor)
        batchExists(batchID)
    {
        require(userRoles[healthcareProvider] == Role.HealthcareProvider, "Invalid provider");
        require(batches[batchID].status == Status.InTransit, "Batch not in transit");
        require(batches[batchID].expiryDate > block.timestamp, "Batch expired");
        
        batches[batchID].healthcareProvider = healthcareProvider;
        batches[batchID].status = Status.Delivered;
        emit BatchTransferred(batchID, healthcareProvider, Status.Delivered);
    }

    function verifyBatch(uint batchID)
        public
        onlyRole(Role.HealthcareProvider)
        batchExists(batchID)
    {
        require(batches[batchID].status == Status.Delivered, "Batch not delivered yet");
        require(batches[batchID].expiryDate > block.timestamp, "Batch expired");
        
        batches[batchID].status = Status.Verified;
        emit BatchVerified(batchID, msg.sender);
    }

    function recallBatch(uint batchID)
        public
        batchExists(batchID)
    {
        require(batches[batchID].status != Status.Recalled, "Already Recalled");
        require(
            msg.sender == regulator ||
            (msg.sender == batches[batchID].manufacturer && batches[batchID].status != Status.Verified) ||
            (msg.sender == batches[batchID].healthcareProvider && batches[batchID].status == Status.Delivered),
            "Not authorized to recall"
        );
        
        batches[batchID].status = Status.Recalled;
        emit BatchRecalled(batchID, msg.sender);
        emit ExpirationAlert(batchID, false, 0);
    }

    // View Functions
    function getBatchDetails(uint batchID)
        public
        view
        batchExists(batchID)
        returns (
            string memory drugName,
            uint quantity,
            uint manufacturingDate,
            uint expiryDate,
            Status status,
            address manufacturer,
            address distributor,
            address healthcareProvider
        )
    {
        Batch memory batch = batches[batchID];
        return (
            batch.drugName,
            batch.quantity,
            batch.manufacturingDate,
            batch.expiryDate,
            batch.status,
            batch.manufacturer,
            batch.distributor,
            batch.healthcareProvider
        );
    }

    function checkExpirationAlert(uint batchID)
        public 
        view 
        batchExists(batchID)
        onlyBatchAuthorized(batchID)
        returns(
            bool isExpired,
            uint daysRemaining,
            bool needsAttention,
            bool isRecalled
        )
    {
        Batch memory batch = batches[batchID];
        isRecalled = (batch.status == Status.Recalled);

        if(isRecalled) {
            return (false, 0, false, true);
        }

        isExpired = (batch.expiryDate <= block.timestamp);
        uint secondsRemaining = batch.expiryDate > block.timestamp
            ? batch.expiryDate - block.timestamp
            : 0;
        
        daysRemaining = secondsRemaining / 1 days;
        needsAttention = isExpired || daysRemaining <= 7;

        return (isExpired, daysRemaining, needsAttention, false);
    }

    // Utility Functions
    function getPendingRequests() public view onlyRegulator returns (address[] memory) {
        return pendingRequests;
    }

    function getRequestStatus(address user) public view returns (RoleRequest memory) {
        return roleRequests[user];
    }
}