const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Payment", function () {
    let Payment;
    let payment;
    let owner;
    let addr1;
    let addr2;
    let addrs;

    // Deploy contract - Current State (Success)
    beforeEach(async function () {
        Payment = await ethers.getContractFactory("Payment");
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
        payment = await Payment.deploy();
        await payment.waitForDeployment();
        // console.log("Payment deployed to: ", payment.target); // address
    });

    // Testing deployed contract - Current State (Success)
    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            expect(await payment.owner()).to.equal(owner.address);
        });
    });

    // Testing addName() - Current State (Success)
    describe("addName Function", function () {
        it("Should allow a user to add name", async function () {
            const name = "Alice";
            await payment.connect(addr1).addName(name);
            const userName = await payment.getMyName(addr1.address);
            expect(userName.name).to.equal(name);
            expect(userName.hasName).to.be.true;
        });
    });

    // Testing createRequest() - Current State (Failed)
    describe("createRequest Function", function () {
        it("Should create a request correctly", async function () {
            const amount = ethers.parseEther("0.005");
            // console.log("amount", typeof amount); // result = bigint
            const message = "Text Request";
            // console.log("message", message);
            await payment.connect(addr1).createRequest(addr2.address, amount, message);
            const requests = await payment.getMyRequests(addr2.address);
            expect(requests[0].amount).to.equal(amount);
            expect(requests[0].message).to.equal(message);
        });
    });

    // Testing payRequest() - Current State (Failed)
    describe("payRequest Function", function () {
        it("Should pay a request correctly", async function () {
            const amount = ethers.parseEther("1");
            const message = "Test Request";
            await payment.connect(addr1).createRequest(owner.address, amount, message);
            // Addr1 pays the request to the owner
            await payment.connect(addr1).payRequest(0, { value: amount });
            // Check if the request is removed
            const requests = await payment.getMyRequests(owner.address);
            expect(requests.length).to.equal(0);
        });
    });

    // Testing getMyRequests() - Current State (Failed)
    describe("getMyRequests Function", function () {
        it("Should return all requests made to a user", async function () {
            const amount = ethers.parseEther("1");
            const message = "Test Request";
            await payment.connect(addr1).createRequest(addr2.address, amount, message);
            await payment.connect(owner).createRequest(addr2.address, amount, message);

            const requests = await payment.getMyRequests(addr2.address);
            expect(requests.length).to.equal(2);
        });
    });

    // Testing getMyHistory() - Current State (Failed)
    // describe("getMyHistory Function", function () {
    //     it("Should return all historical transactions a user has been part of", async function () {
    //         const amount = ethers.parseEther("1");
    //         const message = "Test Request";
    //         await payment.connect(addr1).createRequest(owner.address, amount, message);
    //         await payment.connect(addr1).payRequest(0, { value: amount });

    //         const history = await payment.getMyHistory(addr1.address);
    //         expect(history.length).to.equal(1);
    //         expect(history[0].action).to.equal("Send");
    //         expect(history[0].amount).to.equal(amount);
    //         expect(history[0].message).to.equal(message);
    //     });
    // });
});
