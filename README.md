# 💊 Pharma Supply Chain

A decentralized pharmaceutical supply chain management system built on Ethereum. This DApp ensures transparency, traceability, and trust in the movement of pharmaceutical batches from manufacturers to healthcare providers, with roles for regulators, logistics partners, and more.

## 🚀 Features

- ✅ Role-based access control for different stakeholders
- 🏷️ Batch lifecycle tracking: creation, transfer, verification, and recall
- ⏰ Expiry alerts for medicines
- 🔍 Product verification using batch ID or QR code
- 📜 Batch history and status summary
- 🔐 Secure and transparent on-chain recordkeeping

## 🛠️ Tech Stack

- **Frontend:** Next.js  
- **Smart Contracts:** Solidity  
- **Blockchain Platform:** Ethereum (Ganache for local development)  
- **Tools & Libraries:** MetaMask, Truffle, Ganache, Web3.js.

## 📁 Folder Structure
pharma-supply-chain/
├── client/ # Frontend files (HTML/JS/CSS or React)
└── smartcontract/ # Solidity smart contracts

## 🧑‍💻 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) and npm
- [Ganache](https://trufflesuite.com/ganache/)
- [MetaMask](https://metamask.io/)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/Monalisha-Roy/pharma-supply-chain.git
   cd pharma-supply-chain
2. **Install smart contract dependencies**
  ```bash
  cd smartcontract
  npm install
```
3. **Start Ganache**
  Make sure it's running on http://127.0.0.1:8545.
4. **Deploy the smart contract**
  ```bash
  truffle compile
  truffle migrate
```
5. **Run the frontend**
  ```bash
  cd ../client
  npm install
  npm start
```
6. **Connect MetaMask**
  Import a Ganache account using the private key.
    Set MetaMask network to:
    Network Name: Localhost 8545
    RPC URL: http://127.0.0.1:8545
    Chain ID: 1337

## 🔐 Roles in the System
  -**Manufacturer** – Creates medicine batches
  -**Distributor** – Transfers batches down the supply chain
  -**Healthcare Provider** – Verifies and dispenses medicine
  -**Regulator** – Monitors and approves participants

