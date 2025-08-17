# Blockchain Transaction System (Ethereum dApp)

This repository contains a **blockchain-based transaction application** built on the **Ethereum network** using smart contracts.  
It represents the **decentralized implementation** in a comparative study against centralized payment gateways (e.g., Stripe).

---

## 🚀 Features
- Smart contract for secure, automated fund transfers
- Built with **Solidity** and deployed on Ethereum testnet
- **React frontend** integrated with **Web3.js** for blockchain interaction
- Records all transactions on-chain (immutable and auditable)
- Used for **performance benchmarking** against a centralized system

---

## 🛠️ Tech Stack
- **Solidity** – Smart contract language
- **Ethereum (Testnet)** – Blockchain platform
- **Hardhat** – Contract deployment & testing framework
- **Web3.js** – Blockchain API for frontend
- **React.js** – Frontend for user interaction

---

##  Setup & Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Gorav111/Blockchain-transaction-app.git
   cd blockchain-transaction-app

2. **Install dependencies**

    ```bash
    npm install
    ```

3. Configure environment variables
   - Create a .env file at the project root and add:

    ```bash
    PRIVATE_KEY=your_wallet_private_key
    ALCHEMY_API_KEY=your_alchemy_key  
    ```

4. Compile smart contracts using Hardhat

    ```bash
    npx hardhat compile
    ```

5. Deploy contracts

    ```bash
    npx hardhat run scripts/deploy.js --network sepolia
    ```

6. Start the app
    ```bash
    npm run dev
    ```
