// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./baseControl.sol"; 

contract BatchManager is BaseContract {
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

    function verifyBatch(uint batchID) public onlyRole(Role.HealthcareProvider) batchExists(batchID) {
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

    function getBatchDetails(uint batchID) public view batchExists(batchID) returns (
        string memory drugName,
        uint quantity,
        uint manufacturingDate,
        uint expiryDate,
        Status status,
        address payable manufacturer,
        address payable distributor,
        address payable healthcareProvider
    ) {
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

    function checkExpirationAlert(uint batchID) public view batchExists(batchID) onlyBatchAuthorized(batchID) returns (
        bool isExpired,
        uint daysRemaining,
        bool needsAttention,
        bool isRecalled
    ) {
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

    function getBatchHistory(uint batchID) public view batchExists(batchID) returns (address[] memory) {
        return batchHistory[batchID];
    }

    function getAllBatchesWithStatus() public view returns (BatchSummary[] memory) {
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

    function getBatchStatusCounts() public view returns (uint active, uint recalled, uint inTransit) {
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

    function getTransferredBatchesByManufacturer(address manufacturer) public view returns (BatchSummary[] memory) {
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
