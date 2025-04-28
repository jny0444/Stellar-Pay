import React, { useState } from "react";

const SendMoneyButton = ({ onSend }) => {
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    try {
      setLoading(true);
      await onSend(); // This will be your smart contract function call
    } catch (error) {
      console.error("Transaction failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSend}
      disabled={loading}
      className={`px-6 py-3 rounded-full font-semibold 
        ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"} 
        text-white transition`}
    >
      {loading ? "Sending..." : "Send Money"}
    </button>
  );
};

export default SendMoneyButton;
