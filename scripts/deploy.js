  // import hre from "hardhat";

  // async function main() {
  //   const Transactions = await hre.ethers.getContractFactory("Transactions");
  //   const transactions = await Transactions.deploy();

  //   await transactions.deployed();

  //   console.log("Transactions deployed to:", transactions.address);
  // }

  // main().catch((error) => {
  //   console.error(error);
  //   process.exitCode = 1;
  // });

  import hre from "hardhat";

  async function main() {
    const Transactions = await hre.ethers.getContractFactory("Transactions");
    const transactions = await Transactions.deploy();

    await transactions.waitForDeployment();

    console.log("Transactions deployed to:", await transactions.getAddress());
  }

  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
