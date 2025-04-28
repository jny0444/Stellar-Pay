import React, { useState, useEffect } from "react";

const PayCycleProgress = ({ lastWithdrawalDate }) => {
  const [daysRemaining, setDaysRemaining] = useState(0);

  useEffect(() => {
    if (!lastWithdrawalDate) return;

    const calculateDaysRemaining = () => {
      const cycleLength = 15; // Example: 15-day pay cycle
      const now = new Date();
      const lastWithdrawal = new Date(lastWithdrawalDate);
      const elapsedDays = Math.floor((now - lastWithdrawal) / (1000 * 60 * 60 * 24));
      const remaining = Math.max(cycleLength - elapsedDays, 0);
      setDaysRemaining(remaining);
    };

    calculateDaysRemaining();

    const interval = setInterval(() => {
      calculateDaysRemaining();
    }, 86400000); // Update every 24 hours

    return () => clearInterval(interval); // Clean up
  }, [lastWithdrawalDate]);

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 flex flex-col">
      <h2 className="text-xl font-semibold text-blue-700 mb-4">Pay Cycle Progress</h2>
      <div className="flex-1 flex flex-col justify-center">
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <div className="bg-blue-600 h-3 rounded-full" style={{ width: `${((15 - daysRemaining) / 15) * 100}%` }}></div>
        </div>
        <p className="text-gray-600 text-sm">
          {daysRemaining > 0
            ? `Next Payday: ${daysRemaining} day${daysRemaining !== 1 ? "s" : ""} remaining`
            : "It's Payday! 🎉"}
        </p>
      </div>
    </div>
  );
};

export default PayCycleProgress;
