// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Payment {
    // Define the Owner of the smart contract
    address public owner;

    constructor() {
        owner = msg.sender; // Initialize
    }
    
    // Create Struct and Mapping for request, transaction & name
    struct request {
        address requestor;
        uint256 amount;
        string message;
        string name;
    }

    struct sendReceive {
        string action;
        uint amount;
        string message;
        address otherPartyAddress;
        string otherPartyName;
    }

    struct userName {
        string name;
        bool hasName;
    }

    mapping(address => request[]) requests;
    mapping(address => sendReceive[]) history;
    mapping(address => userName) names;

    // Add a name to wallet address
    function addName(string memory _name) public {
        userName storage newUserName = names[msg.sender]; // storage -> save this to the smart contract
        newUserName.name = _name;
        newUserName.hasName = true;
    }

    // Create a Request
    function createRequest(address user, uint256 _amount, string memory _message) public {
        request memory newRequest; // store temporary in newRequest
        newRequest.requestor = msg.sender;
        newRequest.amount = _amount;
        newRequest.message = _message;
        if(names[msg.sender].hasName) {
            newRequest.name = names[msg.sender].name;
        }
        requests[user].push(newRequest);
    }

    // Pay a Request
    function payRequest(uint256 _request) public payable {
        require(_request < requests[msg.sender].length, "No Such Request!"); // It checks the statement
        request[] storage myRequests = requests[msg.sender]; // 
        request storage payableRequest = myRequests[_request];

        uint256 toPay = payableRequest.amount * 100000000000000000;
        require(msg.value == (toPay), "Pay Correct Amount");

        payable(payableRequest.requestor).transfer(msg.value);

        myRequests[_request] = myRequests[myRequests.length-1];
        myRequests.pop();
    }

    function addHistory(address sender, address receiver, uint256 _amount, string memory _message) private {
        // New Sending
        sendReceive memory newSend;
        newSend.action = "Send";
        newSend.amount = _amount;
        newSend.message = _message;
        newSend.otherPartyAddress = receiver;
        if(names[receiver].hasName) {
            newSend.otherPartyName = names[receiver].name;
        }
        history[sender].push(newSend);

        // New Receive
        sendReceive memory newReceive;
        newReceive.action = "Receive";
        newReceive.amount = _amount;
        newReceive.message =_message;
        newReceive.otherPartyAddress = sender;
        if(names[sender].hasName){
            newReceive.otherPartyName = names[sender].name;
        }
        history[receiver].push(newReceive);
    }

    // Get all requests sent to a user
    function getMyRequests(address _user) public view returns(
        address[] memory,
        uint256[] memory,
        string[] memory,
        string[] memory
    ) {
        address[] memory addrs = new address[](requests[_user].length);
        uint256[] memory amnt = new uint256[](requests[_user].length);
        string[] memory msge = new string[](requests[_user].length);
        string[] memory nme = new string[](requests[_user].length);

        for(uint i = 0; i < requests[_user].length; i++) {
            request storage myRequests = requests[_user][i];
            addrs[i] = myRequests.requestor;
            amnt[i] = myRequests.amount;
            msge[i] = myRequests.message;
            nme[i] = myRequests.name;
        }

        return (addrs, amnt, msge, nme);
    }


    // Get all historical transactions user has been apart of
    function getMyHistory(address _user) public view returns(sendReceive[] memory){
        return history[_user];
    }

    function getMyName(address _user) public view returns(userName memory){
        return names[_user];
    }
}

