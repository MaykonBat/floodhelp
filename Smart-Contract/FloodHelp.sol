// SPDX-License-Identifier: MIT

struct Request {
    uint id;
    address author;
    string title;
    string description;
    string contact;
    uint timestamp;
    uint goal;
    uint balance;
    bool open;
}

pragma solidity ^0.8.26;

contract FloodHelp {

    uint public lastId = 0;
    mapping (uint => Request) public requests;

    function openRequest(string memory title, string memory description, string memory contact, uint goal) public {
        lastId++;
        requests[lastId] = Request({
            id: lastId,
            author: msg.sender,
            title: title,
            description: description,
            contact: contact,
            timestamp: block.timestamp,
            goal: goal,
            balance: 0,
            open: true
        });
    }

    function closeRequest(uint id) public {
        address author = requests[id].author;
        uint balance = requests[id].balance;
        uint goal = requests[id].goal;
        require(requests[id].open && (msg.sender == author || balance >= goal), unicode"Você não pode fechar esse pedido");

        requests[id].open = false;

        if(balance > 0){
            requests[id].balance = 0;
            payable(author).transfer(balance);
        }
    }

    function donate(uint id) public payable{
        requests[id].balance += msg.value;
        if(requests[id].balance >= requests[id].goal)
            closeRequest(id);
    }

    function getOpenRequests(uint startId, uint quantity) public view returns (Request[] memory){
        Request[] memory result = new Request[](quantity);
        uint id = startId;
        uint count = 0;

        do {
            if(requests[id].open){
                result[count] = requests[id];
                count++;
            }

            id++;
        }
        while(count < quantity && id <= lastId);

        return result;
    }
}