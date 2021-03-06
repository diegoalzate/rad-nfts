module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();
  
    await deploy("RadNFT", {
      // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
      from: deployer,
      log: true,
    });
  };

  module.exports.tags = ["RadNFT"];