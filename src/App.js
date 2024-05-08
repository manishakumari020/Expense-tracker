import React, { useState, useEffect } from "react";
import "./App.css";

import Expense from "./components/Expense.js"
import Transactions from "./components/Transactions.js";

import { SnackbarProvider } from "notistack";

const App = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const transactions = JSON.parse(window.localStorage.getItem("expenses"));
    setData(transactions || []);
  }, []);

  const updateTransactions = (updatedExpenses) => {
    // Renamed updateData to updateTransactions
    setData(updatedExpenses);
    window.localStorage.setItem("expenses", JSON.stringify(updatedExpenses));
  };

  return (
    <div
      style={{
        paddingLeft: "2rem",
        paddingRight: "2rem",
        paddingBottom: "2rem",
        width: "auto",
      }}
    >
    <h1 style={{ fontWeight: "bolder" , textAlign: "center"}}>Expense Tracker</h1>
      <SnackbarProvider>
        <Expense updateData={updateTransactions} />
      </SnackbarProvider>
      <Transactions
        transactions={data}
        updateTransactions={updateTransactions}
      />
    </div>
  );
};

export default App;

