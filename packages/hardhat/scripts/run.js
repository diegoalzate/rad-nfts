const main = async () => {
  const nftContractFactory = await hre.ethers.getContractFactory('RadNFT');
  const nftContract = await nftContractFactory.deploy();
  await nftContract.deployed();
  console.log('Contract deployed to: ', nftContract.address);

  let txn = await nftContract.makeARadNFT()

  await txn.wait()

  txn = await nftContract.makeARadNFT()

  await txn.wait()

  const amount = await nftContract.getTotalMinted()

  console.log(amount)
}

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (e) {
    console.log(e)
    process.exit(1)
  }
}

runMain();