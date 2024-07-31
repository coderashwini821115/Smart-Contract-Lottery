const { network, ethers } = require("hardhat")
const fs = require("fs")
const FRONT_END_ADDRESSES_FILE = "../user/constants/contractAddresses.json"
const FRONT_END_ABI_FILE = "../user/constants/abi.json"
module.exports = async function () {
    if (process.env.UPDATE_FRONT_END) {
        console.log("Updating front end...")
        upateContractAddresses()
        updateABI()
    }
}

async function updateABI() {
    const raffle = await ethers.getContract("Raffle")
    fs.writeFileSync(FRONT_END_ABI_FILE, raffle.interface.format(ethers.utils.FormatTypes.json))
}
async function upateContractAddresses() {
    const raffle = await ethers.getContract("Raffle")
    const chainId = network.config.chainId.toString()
    const contractAddress = JSON.parse(fs.readFileSync(FRONT_END_ADDRESSES_FILE, "utf8"))
    if (chainId in contractAddress) {
        if (!contractAddress[chainId].includes(raffle.address)) {
            contractAddress[chainId] = raffle.address
        }
    } else {
        contractAddress[chainId] = [raffle.address]
    }
    fs.writeFileSync(FRONT_END_ADDRESSES_FILE, JSON.stringify(contractAddress))
}
module.exports.tags = ["all", "frontend"]
