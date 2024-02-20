import { ethers } from "hardhat";

const main = async () => {
  const transactionsFactory = await ethers.getContractFactory("Transaction");
  const transactionsContract = await transactionsFactory.deploy();

  await transactionsContract.waitForDeployment();

  console.log("Transactions address: ", transactionsContract.target);
};

const runMain = async () => {
  try{
    await main();
    process.exit(0);
  }
  catch(error){
    console.error(error);
    process.exit(1);
  }
}

runMain();