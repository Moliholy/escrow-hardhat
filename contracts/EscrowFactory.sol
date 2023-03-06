// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "./Escrow.sol";

contract EscrowFactory {
    address[] public instances;

    event Created(address indexed arbiter, address indexed beneficiary, address indexed depositor);

    function create(address _arbiter, address _beneficiary) external payable {
        instances.push(
            address((new Escrow){value: msg.value}(_arbiter, _beneficiary, msg.sender))
        );
        emit Created(_arbiter, _beneficiary, msg.sender);
    }

    function getInstances() external view returns (address[] memory) {
        return instances;
    }
}
