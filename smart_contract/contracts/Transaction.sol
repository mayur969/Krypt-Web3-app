// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Transaction{

    event Transfer(address from, address receiver, uint amount, string message, uint timestamp, string keyword);

    struct TransferStruct{
        address sender;
        address receiver;
        uint amount;
        string message;
        uint timeStamp;
        string keyword;
    }

    TransferStruct[] transactions;

    function addToBlockchain(address payable receiver, uint amount, string memory message, string memory keyword) public {
        transactions.push(TransferStruct( msg.sender, receiver, amount, message, block.timestamp, keyword));

        emit Transfer(msg.sender, receiver, amount, message, block.timestamp, keyword);
    }

    function getAllTransactions() view public returns(TransferStruct[] memory){
        return transactions;
    }

    function getTransactionCount() view public returns(uint256) {

    }

}