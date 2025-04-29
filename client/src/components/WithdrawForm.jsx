import React, { useState } from 'react';

const WithdrawForm = ({ onWithdraw }) => {
  const [amount, setAmount] = useState('');

  const handleWithdraw = () => {
    if (amount) {
      onWithdraw(amount); // pass selected amount to parent
      setAmount(''); // reset selection
    } else {
      alert('Please select an amount to withdraw');
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      {/* Dropdown */}
      <select
        className="w-full bg-gray-100 text-blue-800 py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      >
        <option value="" disabled>Select amount to withdraw</option>
        <option value="100">$100</option>
        <option value="200">$200</option>
        <option value="300">$300</option>
        <option value="400">$400</option>
        <option value="500">$500</option>
      </select>

      {/* Withdraw Button */}
      <button
        className="w-full bg-blue-700 text-white py-3 rounded-xl hover:bg-blue-800 transition"
        onClick={handleWithdraw}
      >
        Withdraw
      </button>
    </div>
  );
};

export default WithdrawForm;
