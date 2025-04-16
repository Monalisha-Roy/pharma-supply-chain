// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PharmaSupplyChain {
    // Role Definitions
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

    // State Variables
    address payable public regulator;
    uint public nextBatchID;
    mapping(address => Role) public userRoles;
    mapping(uint => Batch) public batches;
    mapping(address => RoleRequest) public roleRequests;
    address[] public pendingRequests;
    mapping(address => uint) private requestIndices;
    mapping(uint => uint) public batchStatusTimestamps;
    mapping(uint => address[]) public batchHistory;

    // Events
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

    // Modifiers
    modifier onlyRole(Role requiredRole) {
        require(
            userRoles[msg.sender] == requiredRole,
            "Not authorized for this action"
        );
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
        regulator = payable(msg.sender);
        userRoles[msg.sender] = Role.Regulator;
        nextBatchID = 1;
        emit RoleAssigned(msg.sender, Role.Regulator);
    }

    // Role Management Functions
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
        require(
            manufacturingDate < expiryDate,
            "Invalid manufacturing/expiry date"
        );
        require(
            manufacturingDate <= block.timestamp,
            "Manufacturing date cannot be in the future"
        );

        batches[nextBatchID] = Batch({
            batchID: nextBatchID,
            drugName: drugName,
            quantity: quantity,
            manufacturingDate: manufacturingDate,
            expiryDate: expiryDate,
            manufacturer: payable(msg.sender),
            distributor: payable(address(0)),
            healthcareProvider: payable(address(0)),
            status: Status.Created
        });

        batchStatusTimestamps[nextBatchID] = block.timestamp;
        batchHistory[nextBatchID].push(msg.sender);
        emit BatchCreated(
            nextBatchID,
            drugName,
            quantity,
            manufacturingDate,
            expiryDate,
            msg.sender
        );
        nextBatchID++;
    }

    function transferToDistributor(
        uint batchID,
        address payable distributor
    ) public onlyRole(Role.Manufacturer) batchExists(batchID) {
        require(
            userRoles[distributor] == Role.Distributor,
            "Invalid distributor"
        );
        require(
            batches[batchID].status == Status.Created,
            "Batch not ready for transfer"
        );
        require(batches[batchID].expiryDate > block.timestamp, "Batch expired");

        batches[batchID].distributor = distributor;
        batches[batchID].status = Status.InTransit;
        batchStatusTimestamps[batchID] = block.timestamp;
        batchHistory[batchID].push(msg.sender);
        batchHistory[batchID].push(distributor);
        emit BatchTransferred(batchID, distributor, Status.InTransit);
    }

    function transferToHealthcare(
        uint batchID,
        address payable healthcareProvider
    ) public onlyRole(Role.Distributor) batchExists(batchID) {
        require(
            userRoles[healthcareProvider] == Role.HealthcareProvider,
            "Invalid provider"
        );
        require(
            batches[batchID].status == Status.InTransit,
            "Batch not in transit"
        );
        require(batches[batchID].expiryDate > block.timestamp, "Batch expired");

        batches[batchID].healthcareProvider = healthcareProvider;
        batches[batchID].status = Status.Delivered;
        batchStatusTimestamps[batchID] = block.timestamp;
        batchHistory[batchID].push(msg.sender);
        batchHistory[batchID].push(healthcareProvider);
        emit BatchTransferred(batchID, healthcareProvider, Status.Delivered);
    }

    function verifyBatch(
        uint batchID
    ) public onlyRole(Role.HealthcareProvider) batchExists(batchID) {
        require(
            batches[batchID].status == Status.Delivered,
            "Batch not delivered yet"
        );
        require(batches[batchID].expiryDate > block.timestamp, "Batch expired");

        batches[batchID].status = Status.Verified;
        batchStatusTimestamps[batchID] = block.timestamp;
        batchHistory[batchID].push(msg.sender);
        emit BatchVerified(batchID, msg.sender);
    }

    function recallBatch(uint batchID) public batchExists(batchID) {
        require(batches[batchID].status != Status.Recalled, "Already Recalled");
        require(
            msg.sender == regulator ||
                (msg.sender == batches[batchID].manufacturer &&
                    batches[batchID].status != Status.Verified) ||
                (msg.sender == batches[batchID].healthcareProvider &&
                    batches[batchID].status == Status.Delivered),
            "Not authorized to recall"
        );

        batches[batchID].status = Status.Recalled;
        batchStatusTimestamps[batchID] = block.timestamp;
        batchHistory[batchID].push(msg.sender);
        emit BatchRecalled(batchID, msg.sender);
        emit ExpirationAlert(batchID, false, 0);
    }

    // View Functions
    function getBatchDetails(
        uint batchID
    )
        public
        view
        batchExists(batchID)
        returns (
            string memory drugName,
            uint quantity,
            uint manufacturingDate,
            uint expiryDate,
            Status status,
            address payable manufacturer,
            address payable distributor,
            address payable healthcareProvider
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

    function checkExpirationAlert(
        uint batchID
    )
        public
        view
        batchExists(batchID)
        onlyBatchAuthorized(batchID)
        returns (
            bool isExpired,
            uint daysRemaining,
            bool needsAttention,
            bool isRecalled
        )
    {
        Batch memory batch = batches[batchID];
        isRecalled = (batch.status == Status.Recalled);

        if (isRecalled) {
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
    function getPendingRequests()
        public
        view
        onlyRegulator
        returns (address[] memory)
    {
        return pendingRequests;
    }

    function getRequestStatus(
        address user
    ) public view returns (RoleRequest memory) {
        return roleRequests[user];
    }

    function getPendingRequestsWithRoles()
        public
        view
        onlyRegulator
        returns (PendingRequest[] memory)
    {
        PendingRequest[] memory requests = new PendingRequest[](
            pendingRequests.length
        );

        for (uint i = 0; i < pendingRequests.length; i++) {
            address user = pendingRequests[i];
            requests[i] = PendingRequest({
                user: user,
                requestedRole: roleRequests[user].requestedRole
            });
        }

        return requests;
    }

    // View Ownership Transfer History
    function getBatchHistory(
        uint batchID
    ) public view batchExists(batchID) returns (address[] memory) {
        return batchHistory[batchID];
    }

    function getAllBatchesWithStatus()
        public
        view
        returns (BatchSummary[] memory)
    {
        uint totalBatches = nextBatchID - 1;
        BatchSummary[] memory summaries = new BatchSummary[](totalBatches);

        for (uint i = 1; i <= totalBatches; i++) {
            summaries[i - 1] = BatchSummary({
                batchID: i,
                status: batches[i].status,
                expiryDate: batches[i].expiryDate
            });
        }

        return summaries;
    }

    function getBatchStatusCounts()
        public
        view
        returns (uint active, uint recalled, uint inTransit)
    {
        uint totalBatches = nextBatchID - 1;
        active = 0;
        recalled = 0;
        inTransit = 0;

        for (uint i = 1; i <= totalBatches; i++) {
            Status status = batches[i].status;

            if (
                status == Status.Verified ||
                status == Status.Delivered ||
                status == Status.Created
            ) {
                active++;
            } else if (status == Status.Recalled) {
                recalled++;
            } else if (status == Status.InTransit) {
                inTransit++;
            }
        }

        return (active, recalled, inTransit);
    }

    function getTransferredBatchesByManufacturer(
        address manufacturer
    ) public view returns (BatchSummary[] memory) {
        uint totalBatches = nextBatchID - 1;
        uint count = 0;

        for (uint i = 1; i <= totalBatches; i++) {
            if (
                batches[i].manufacturer == manufacturer &&
                (batches[i].status == Status.InTransit ||
                    batches[i].status == Status.Delivered ||
                    batches[i].status == Status.Verified)
            ) {
                count++;
            }
        }

        BatchSummary[] memory transferredBatches = new BatchSummary[](count);
        uint index = 0;

        for (uint i = 1; i <= totalBatches; i++) {
            if (
                batches[i].manufacturer == manufacturer &&
                (batches[i].status == Status.InTransit ||
                    batches[i].status == Status.Delivered ||
                    batches[i].status == Status.Verified)
            ) {
                transferredBatches[index] = BatchSummary({
                    batchID: i,
                    status: batches[i].status,
                    expiryDate: batches[i].expiryDate
                });
                index++;
            }
        }

        return transferredBatches;
    }

    function getRecalledBatches() public view returns (BatchSummary[] memory) {
        uint totalBatches = nextBatchID - 1;
        uint count = 0;

        for (uint i = 1; i <= totalBatches; i++) {
            if (batches[i].status == Status.Recalled) {
                count++;
            }
        }

        BatchSummary[] memory recalledBatches = new BatchSummary[](count);
        uint index = 0;

        for (uint i = 1; i <= totalBatches; i++) {
            if (batches[i].status == Status.Recalled) {
                recalledBatches[index] = BatchSummary({
                    batchID: i,
                    status: batches[i].status,
                    expiryDate: batches[i].expiryDate
                });
                index++;
            }
        }

        return recalledBatches;
    }
}