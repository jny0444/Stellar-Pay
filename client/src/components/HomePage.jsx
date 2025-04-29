import React, { useState, useEffect } from "react";
import { isConnected, getPublicKey } from '@stellar/freighter-api';
import PayCycleProgress from "./PayCycleProgress";
import WithdrawForm from './WithdrawForm';

const HomePage = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [lastWithdrawalDate, setLastWithdrawalDate] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [payCycleProgress, setPayCycleProgress] = useState(0);
  const [availableBalance, setAvailableBalance] = useState(850); 

  const handleWithdraw = (amount) => {
    if (amount > availableBalance) {
      alert("You don't have enough balance to withdraw this amount.");
      return;
    }
  
    const newTransaction = {
      type: 'Withdrawal',
      amount,
      date: new Date().toLocaleDateString(), // format: MM/DD/YYYY
    };
  
    setTransactions([newTransaction, ...transactions]);
    setAvailableBalance(prevBalance => prevBalance - amount); // Deduct amount
    setLastWithdrawalDate(new Date());
  };
  

  const connectWallet = async () => {
    if (window.freighterApi) {
      try {
        await window.freighterApi.connect();
        const publicKey = await window.freighterApi.getPublicKey();
        console.log('Connected Wallet:', publicKey);
        setWalletAddress(publicKey);
      } catch (error) {
        console.error('Failed to connect Freighter:', error);
        alert('Connection to Freighter failed. Please approve connection!');
      }
    } else {
      alert("Please install Freighter wallet");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-[#0f0c29] via-[#302b63] to-[#24243e] text-white px-4">
      {/* Header */}
      <header className="w-full max-w-5xl flex justify-between items-center py-6">
        <h1 className="text-4xl font-extrabold text-white-800 text-center w-full">
         StellarPay
        </h1>

        {walletAddress ? (
          <div className="px-4 py-2 bg-green-700 text-white rounded-lg">
            Connected: {walletAddress.substring(0, 6)}...{walletAddress.slice(-4)}
          </div>
        ) : (
          <button
            onClick={connectWallet}
            className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition"
          >
            Connect Wallet
          </button>
        )}
      </header>

      {/* Main Dashboard */}
      <main className="w-full max-w-5xl mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Earnings Summary */}
        <div className="col-span-3 bg-white shadow-lg rounded-2xl p-6 flex flex-col justify-between">
          <h2 className="text-xl font-semibold text-blue-700 mb-4">Earnings Summary</h2>

          <div className="text-5xl font-bold text-blue-900 mb-2">
  ${availableBalance.toFixed(2)}
</div>
          <p className="text-gray-500">Available to Withdraw</p>

          {/* Withdraw Form */}
          <div className="mt-6 space-y-4">
            <WithdrawForm onWithdraw={handleWithdraw} />
          </div>

          {/* Pay Cycle Progress */}
          <PayCycleProgress lastWithdrawalDate={lastWithdrawalDate} />
        </div>

        {/* Transaction History */}
        <div className="col-span-3 bg-white shadow-lg rounded-2xl p-6 mt-6">
          <h2 className="text-xl font-semibold text-blue-700 mb-4">Recent Transactions</h2>
          {transactions.length === 0 ? (
            <p className="text-gray-500">No recent transactions yet.</p>
          ) : (
            <ul className="space-y-4">
              {transactions.map((tx, index) => (
                <li key={index} className="flex justify-between text-gray-700">
                  <span>{tx.type}</span>
                  <span>${tx.amount}.00</span>
                  <span>{tx.date}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
};

export default HomePage;
