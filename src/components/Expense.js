import React, { useState, useEffect } from "react";
import Button from "./Button.js";
import ReactModal from "react-modal";
import { useSnackbar } from "notistack";
import LineChart from "./LineChart.js";

import "./Expense.css";

const Expense = ({ updateData }) => {
  const { enqueueSnackbar } = useSnackbar();

  const [walletBalance, setWalletBalance] = useState(5000);
  const [expense, setExpense] = useState(0);

  const [incomeAmount, setIncomeAmount] = useState();
  const [expenseAmount, setExpenseAmount] = useState([]); // Initialize as empty array for tracking all the expenses

  const [dataToSendToLocalStorage, setDataToSendToLocalStorage] = useState([]);
  const [fetchDataForPie, setFetchDataForPie] = useState([]);

  const [showAddBalanceModal, setShowAddBalanceModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);

  useEffect(() => {
    const storedExpenses =
      JSON.parse(window.localStorage.getItem("expenses")) || [];
    const transformedData = storedExpenses.map((entry) => ({
      name: entry.category,
      value: parseFloat(entry.price),
    }));
    setFetchDataForPie(transformedData);
  }, []);
  //console.log(fetchDataForPie);

  const [inputData, setInputData] = useState({
    title: "",
    price: "",
    category: "",
    date: "",
    wallet_Balance: walletBalance,
    expense: 0,
  }); // Initialize as empty array for multiple sets of input data

  const openModalForAddBalanceToWallet = () => {
    setShowAddBalanceModal(true);
  };

  const openModalForAddExpense = () => {
    setShowAddExpenseModal(true);
  };

  const handleSubmitExpense = () => {
    const currentExpense = parseFloat(inputData.price);

    if (currentExpense > walletBalance || walletBalance - currentExpense < 0) {
      enqueueSnackbar("Not Enough Balance, Try adding More Money", {
        variant: "error",
        autoHideDuration: 3000,
        anchorOrigin: {
          vertical: "top",
          horizontal: "center",
        },
      });
      return;
    }

    // Update the expense array with the current expense
    const updatedExpenseArr = [...expenseAmount, currentExpense];
    setExpenseAmount(updatedExpenseArr);

    // Calculate the new wallet balance
    const newWalletBalance = walletBalance - currentExpense;

    // Prepare the expense data object with the updated wallet balance
    const expenseData = {
      title: inputData.title,
      price: currentExpense,
      category: inputData.category,
      date: inputData.date,
      wallet_Balance: newWalletBalance,
      expense: updatedExpenseArr.reduce((total, expense) => total + expense, 0),
    };

    // Store the updated expenses array in localStorage
    const updatedExpenses = [...dataToSendToLocalStorage, expenseData];
    setDataToSendToLocalStorage(updatedExpenses);
    window.localStorage.setItem("expenses", JSON.stringify(updatedExpenses));

    // Calculate the total expense
    const totalExpense = updatedExpenseArr.reduce(
      (total, expense) => total + expense,
      0
    );

    // Update the expense state
    updateData(updatedExpenses);

    // Clear input fields after submitting expense and close the modal
    setInputData({
      title: "",
      price: "",
      category: "",
      date: "",
    });

    // Update the wallet balance state
    setWalletBalance(newWalletBalance);
    setExpense(totalExpense);

    // Close the modal
    setShowAddExpenseModal(false);
  };

  const handleSubmitAddAmount = () => {
    // Retrieve the expenses data from localStorage
    const expensesData = JSON.parse(window.localStorage.getItem("expenses"));

    // Calculate the new wallet balance by adding the income amount
    const amountToBeAdded = parseFloat(incomeAmount);
    const newBalance = amountToBeAdded + walletBalance;

    // Update the wallet balance state
    setWalletBalance(newBalance);

    // Update the wallet_balance property in each expenseData object
    const updatedExpensesData = expensesData.map((expense) => ({
      ...expense,
      wallet_Balance: newBalance,
    }));

    // Update the expenses data in localStorage
    window.localStorage.setItem(
      "expenses",
      JSON.stringify(updatedExpensesData)
    );

    // Clear the input field after updating wallet balance
    setIncomeAmount("");
  };

  return (
    <div
      className="expenseMainContainer"
      style={{
        background: "rgba(98, 98, 98, 1)",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        borderRadius: "1rem",
        padding: "2rem",
        gap: "2rem",
      }}
    >
      <Button
        walletBalance={
          localStorage.getItem("expenses") &&
          JSON.parse(localStorage.getItem("expenses")).length > 0
            ? JSON.parse(localStorage.getItem("expenses"))[
                JSON.parse(localStorage.getItem("expenses")).length - 1
              ].wallet_Balance
            : walletBalance
        }
        Heading="Income"
        Type="Income"
        colorForMoney={"rgba(157, 255, 91, 1)"}
        gradientForButton={"linear-gradient(90deg, #B5DC52 0%, #89E148 100%)"}
        onClick={() => {
          openModalForAddExpense();
        }}
      />

      <Button
        walletBalance={
          localStorage.getItem("expenses") &&
          JSON.parse(localStorage.getItem("expenses")).length > 0
            ? JSON.parse(localStorage.getItem("expenses"))[
                JSON.parse(localStorage.getItem("expenses")).length - 1
              ].expense
            : expense
        }
        Heading="Expense"
        Type="Expense"
        colorForMoney={"rgba(246, 164, 10, 0.93)"}
        gradientForButton={
          "linear-gradient(90deg, #FF9595 0%, #FF4747 80%, #FF3838 100%)"
        }
        onClick={() => openModalForAddBalanceToWallet()}
      />

      <ReactModal
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            width: "auto",
            minHeight: "auto",
            borderRadius: "1rem",
          },
          content: {
            width: "auto",
            height: "20rem",
            margin: "auto",
          },
        }}
        isOpen={showAddBalanceModal}
        onRequestClose={() => setShowAddBalanceModal(false)}
      >
        <div style={{ color: "black" }}>
          <h2>Add Expenses</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault(); 
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "1rem",
                marginBottom: "3rem",
              }}
            >
              <input
                style={{
                  width: "50%",
                  padding: "1rem",
                  borderRadius: "1rem",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.6)",
                }}
                type="text"
                placeholder="Title"
                value={inputData.title}
                onChange={(e) =>
                  setInputData({ ...inputData, title: e.target.value })
                }
              />
              <input
                style={{
                  width: "50%",
                  padding: "1rem",
                  borderRadius: "1rem",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.6)",
                }}
                type="number"
                placeholder="Price"
                value={inputData.price}
                onChange={(e) =>
                  setInputData({ ...inputData, price: e.target.value })
                }
              />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "1rem",
                marginBottom: "3rem",
              }}
            >
              <input
                style={{
                  width: "50%",
                  padding: "1rem",
                  borderRadius: "1rem",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.6)",
                }}
                type="text"
                placeholder="Category"
                value={inputData.category}
                onChange={(e) =>
                  setInputData({ ...inputData, category: e.target.value })
                }
              />
              <input
                style={{
                  width: "50%",
                  padding: "1rem",
                  borderRadius: "1rem",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.6)",
                }}
                type="date"
                placeholder="Date"
                value={inputData.date}
                max={new Date().toISOString().split("T")[0]}
                onChange={(e) =>
                  setInputData({ ...inputData, date: e.target.value })
                }
              />
            </div>
          </form>

          <div style={{ display: "flex", flexDirection: "row", gap: "2rem" }}>
            <button
              style={{
                padding: "1rem",
                borderRadius: "1rem",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.6)",
                background: "rgba(244, 187, 74, 1)",
              }}
              onClick={() => handleSubmitExpense()}
            >
              Add Expense
            </button>
            <button
              style={{
                padding: "1rem",
                borderRadius: "1rem",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.6)",
              }}
              onClick={() => setShowAddBalanceModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </ReactModal>

      <ReactModal
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            width: "auto",
            minHeight: "auto",
            borderRadius: "1rem",
          },
          content: {
            width: "auto",
            height: "10rem",
            margin: "auto",
          },
        }}
        isOpen={showAddExpenseModal}
        onRequestClose={() => setShowAddExpenseModal(false)}
      >
        <div>
          <h1 style={{ color: "black" }}>Add Amount</h1>
          <div style={{ display: "flex", flexDirection: "row", gap: "0.5rem" }}>
            <input
              style={{
                width: "50%",
                padding: "1rem",
                borderRadius: "1rem",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.6)",
              }}
              type="number"
              placeholder="Amount"
              value={incomeAmount}
              onChange={(e) => setIncomeAmount(parseFloat(e.target.value) || 0)}
            />
            <button
              style={{
                padding: "1rem",
                borderRadius: "1rem",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.6)",
              }}
              onClick={() => handleSubmitAddAmount()}
            >
              Add Amount
            </button>
            <button
              style={{
                padding: "1rem",
                borderRadius: "1rem",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.6)",
              }}
              onClick={() => setShowAddExpenseModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </ReactModal>

      <LineChart data={fetchDataForPie} />
    </div>
  );
};

export default Expense;