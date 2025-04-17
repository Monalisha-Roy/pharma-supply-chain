const BatchManagement = artifacts.require("BatchManagement");

module.exports = async function (deployer) {
  deployer.deploy(BatchManagement);
}