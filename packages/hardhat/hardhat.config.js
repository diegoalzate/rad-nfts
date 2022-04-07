require("@nomiclabs/hardhat-waffle");
require('dotenv').config({
  path: '../../.env'
})

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.1",
  networks: {
    rinkeby: {
      url: process.env.RINKEBY_URL,
      accounts: [process.env.RINKEBY_ACCOUNT]
    }
  }
};
