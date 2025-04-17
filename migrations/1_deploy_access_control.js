const AccessComtrol = artifacts.require("AccessComtrol");

module.exports = async function (deployer) {
  deployer.deploy(AccessComtrol);
}