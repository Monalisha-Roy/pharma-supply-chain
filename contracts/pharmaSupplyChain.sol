// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./RoleManager.sol";
import "./BatchManager.sol";

contract PharmaSupplyChain is RoleManager, BatchManager {
    constructor() {
        regulator = payable(msg.sender);
        userRoles[msg.sender] = Role.Regulator;
        nextBatchID = 1;
        emit RoleAssigned(msg.sender, Role.Regulator);
    }
}