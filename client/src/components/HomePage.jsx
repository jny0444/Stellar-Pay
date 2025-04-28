import React from "react";
import { useState,useEffect } from "react";
import SendMoneyButton from "./SendMoneyButton.jsx";
import { isConnected, getPublicKey } from '@stellar/freighter-api';
import PayCycleProgress from "./PayCycleProgress";




const HomePage = () => {

  const [walletAddress, setWalletAddress] = useState(null);
  const [lastWithdrawalDate, setLastWithdrawalDate] = useState(null);

  const handleWithdraw = () => {
    // User withdraws...
    setLastWithdrawalDate(new Date()); // Set today's date as the withdrawal date
  };




  const connectWallet = async () => {
    if (window.freighterApi) {
      try {
        await window.freighterApi.connect(); // <-- First, request Freighter to connect
        const publicKey = await window.freighterApi.getPublicKey(); // <-- Then get the public key
        console.log('Connected Wallet:', publicKey);
        return publicKey;
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
     <h1 className="text-4xl font-extrabold text-blue-800 text-center w-full">
  WageAccess
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
        <div className="col-span-2 bg-white shadow-lg rounded-2xl p-6 flex flex-col justify-between">
  <h2 className="text-xl font-semibold text-blue-700 mb-4">Earnings Summary</h2>
  
  <div className="text-5xl font-bold text-blue-900 mb-2">$850.00</div>
  <p className="text-gray-500">Available to Withdraw</p>

  {/* Buttons Section */}
  <div className="mt-6 space-y-4">
    {/* Withdraw Button */}
    {/* Withdraw Section */}
<div className="flex flex-col space-y-4">
  {/* Dropdown */}
  <select
    className="w-full bg-gray-100 text-blue-800 py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
    defaultValue=""
  >
    <option value="" disabled>Select amount to withdraw</option>
    <option value="100">$100</option>
    <option value="200">$200</option>
    <option value="300">$300</option>
    <option value="400">$400</option>
    <option value="500">$500</option>
  </select>

  {/* Withdraw Button */}
  <button className="w-full bg-blue-700 text-white py-3 rounded-xl hover:bg-blue-800 transition">
    Withdraw Selected Amount
  </button>
</div>


    {/* Send Money Button */}
    <SendMoneyButton onSend={async () => {
      console.log("Smart contract called!");
    }} />
  </div>
</div>

        {/* Pay Cycle Progress */}
        <>

      {/* Pay Cycle Progress Section */}
      <PayCycleProgress lastWithdrawalDate={lastWithdrawalDate} />

      {/* Withdraw Button */}
      <button onClick={handleWithdraw} className="w-full bg-blue-700 text-white py-3 rounded-xl hover:bg-blue-800 transition">
        Withdraw Selected Amount
      </button>

      
    </>

        {/* Transaction History */}
        <div className="col-span-3 bg-white shadow-lg rounded-2xl p-6 mt-6">
          <h2 className="text-xl font-semibold text-blue-700 mb-4">Recent Transactions</h2>
          <ul className="space-y-4">
            <li className="flex justify-between text-gray-700">
              <span>Withdrawal</span>
              <span>$200.00</span>
              <span>April 20, 2025</span>
            </li>
            <li className="flex justify-between text-gray-700">
              <span>Withdrawal</span>
              <span>$150.00</span>
              <span>April 10, 2025</span>
            </li>
            <li className="flex justify-between text-gray-700">
              <span>Withdrawal</span>
              <span>$300.00</span>
              <span>March 30, 2025</span>
            </li>
          </ul>
        </div>

      </main>
    </div>
  );
};

export default HomePage;
