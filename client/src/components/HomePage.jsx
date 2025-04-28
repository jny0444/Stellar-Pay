import React from "react";
import SendMoneyButton from "./SendMoneyButton.jsx";

const HomePage = () => {
  return (
    
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-[#0f0c29] via-[#302b63] to-[#24243e] text-white px-4">
      
      
      <header className="w-full max-w-5xl flex justify-between items-center py-6">
        <h1 className="text-2xl font-bold text-blue-800">WageAccess</h1>
        <button className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition">
          Withdraw Now
        </button>
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
    <button className="w-full bg-blue-700 text-white py-3 rounded-xl hover:bg-blue-800 transition">
      Withdraw Earnings
    </button>

    {/* Send Money Button */}
    <SendMoneyButton onSend={async () => {
      console.log("Smart contract called!");
    }} />
  </div>
</div>

        {/* Pay Cycle Progress */}
        <div className="bg-white shadow-lg rounded-2xl p-6 flex flex-col">
          <h2 className="text-xl font-semibold text-blue-700 mb-4">Pay Cycle Progress</h2>
          <div className="flex-1 flex flex-col justify-center">
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <div className="bg-blue-600 h-3 rounded-full w-2/3"></div> {/* 66% */}
            </div>
            <p className="text-gray-600 text-sm">Next Payday: 5 days remaining</p>
          </div>
        </div>

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
