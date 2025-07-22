import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import TransactionArtifact from '../contracts/Transaction.json';

const Web3Context = createContext();

export const useWeb3 = () => useContext(Web3Context);

const contractAddress = '0xe37270C57cd24815c62710F587bD87D3B381304d'; // <-- Replace with your actual contract address

export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('');
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const init = async () => {
      await checkNetwork();
      await checkIfWalletIsConnected();
    };
    init();
  }, []);

  const checkNetwork = async () => {
    if (window.ethereum) {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      if (chainId !== '0xaa36a7') {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0xaa36a7' }], // Sepolia
          });
        } catch {
          toast.error('Please switch to Sepolia Testnet manually in MetaMask.');
        }
      }
    }
  };

  const checkIfWalletIsConnected = async () => {
    if (!window.ethereum) return alert('Please install MetaMask.');

    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    if (accounts.length) {
      setAccount(accounts[0]);
      await getBalance(accounts[0]);
      await getTransactionHistory();
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) return alert('Please install MetaMask.');

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      await getBalance(accounts[0]);
      await getTransactionHistory();
      toast.success('Wallet connected successfully!');
    } catch {
      toast.error('Failed to connect wallet');
    }
  };

  const disconnectWallet = () => {
    setAccount('');
    setBalance('');
    setTransactions([]);
    toast.info('Wallet disconnected');
  };

  const getBalance = async (address) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const balance = await provider.getBalance(address);
      setBalance(ethers.utils.formatEther(balance));
    } catch (err) {
      console.error('Error getting balance:', err);
    }
  };

  const sendTransaction = async (to, amount, keyword, message) => {
    if (!window.ethereum) return alert('Please install MetaMask.');

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, TransactionArtifact.abi, signer);

      if (!ethers.utils.isAddress(to)) throw new Error('Invalid recipient address');

      const amountString = amount.toString().trim();
      if (!/^\d*\.?\d+$/.test(amountString)) throw new Error('Amount must be a valid number');

      const parsedAmount = ethers.utils.parseEther(amountString);

      const transaction = await contract.addToBlockchain(
        to,
        parsedAmount,
        message,
        keyword,
        { value: parsedAmount }
      );

      toast.info('Transaction in progress...');
      await transaction.wait();
      toast.success('Transaction successful!');

      await getBalance(account);
      await getTransactionHistory();
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Transaction failed.');
    }
  };

  const getTransactionHistory = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, TransactionArtifact.abi, provider);
      const txns = await contract.getAllTransactions();

      const structured = txns.map((txn) => ({
        addressFrom: txn.sender,
        addressTo: txn.receiver,
        amount: ethers.utils.formatEther(txn.amount),
        message: txn.message,
        timestamp: new Date(txn.timestamp.toNumber() * 1000).toLocaleString(),
        keyword: txn.keyword,
      }));

      setTransactions(structured);
    } catch (err) {
      console.error('Failed to fetch transaction history:', err);
    }
  };

  return (
    <Web3Context.Provider
      value={{
        account,
        balance,
        transactions,
        connectWallet,
        disconnectWallet,
        sendTransaction,
        getTransactionHistory,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};
