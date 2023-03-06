const hre = require("hardhat");
const fs = require("fs");

async function main() {
    const EscrowFactory = await hre.ethers.getContractFactory("EscrowFactory");
    const escrowFactory = await EscrowFactory.deploy();
    await escrowFactory.deployed();
    console.log(`Factory deployed to ${escrowFactory.address}`);

    fs.writeFileSync(`${__dirname}/../app/.env`, `REACT_APP_FACTORY_CONTRACT_ADDRESS="${escrowFactory.address}"`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
