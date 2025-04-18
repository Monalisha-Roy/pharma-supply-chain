const PharmaSupplyChain = artifacts.require("PharmaSupplyChain");

module.exports = async function (deployer) {
  deployer.deploy(PharmaSupplyChain);
}