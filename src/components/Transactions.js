import React, { useState, useEffect } from "react";

import { MdOutlineFoodBank } from "react-icons/md";
import { GiClothes } from "react-icons/gi";
import { MdMovieCreation } from "react-icons/md";
import { FaBusSimple } from "react-icons/fa6";
import { MdDisabledByDefault } from "react-icons/md"; 
import { CiEdit } from "react-icons/ci";
import { MdCancel } from "react-icons/md";
import { FaRupeeSign } from "react-icons/fa";
import { BiLeftArrowAlt } from "react-icons/bi";
import { BiRightArrowAlt } from "react-icons/bi";

import BarGraph from "./BarChart"

import "./Transaction.css";

const ITEMS_PER_PAGE = 3; 

const Transactions = ({ transactions, updateTransactions }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [editIndex, setEditIndex] = useState(-1);
  const [editedPrice, setEditedPrice] = useState("");

  const [dataForBarGraph, setDataForBarGraph] = useState([]);

  //console.log(transactions);
  useEffect(() => {
    const getDataFromLocalStorage = JSON.parse(
      window.localStorage.getItem("expenses")
    );
    if (getDataFromLocalStorage) {
      const getDataForBar = getDataFromLocalStorage.map((transaction) => ({
        name: transaction.category,
        value: parseFloat(transaction.price),
      }));
      setDataForBarGraph(getDataForBar);
    } else {
      setDataForBarGraph([]);
    }
  }, []);

  
  if (typeof transactions === "undefined" || !Array.isArray(transactions)) {
    transactions = [];
  }

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentTransactions = transactions.slice(startIndex, endIndex);

  // Function to handle pagination
  const goToNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const goToPrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditedPrice(transactions[index].price);
  };

  const handleSave = (index) => {

    transactions[index].price = editedPrice;
    updateTransactions(transactions);

    setEditIndex(-1);
  };

  const handleCancel = () => {

    setEditIndex(-1);
  };

  const handleRemove = (index) => {
    const updatedTransactions = [
      ...transactions.slice(0, index),
      ...transactions.slice(index + 1),
    ];


    updateTransactions(updatedTransactions);
  };

  return (
    <div style={{ marginBottom: "2rem" }}>
      {transactions && transactions.length > 0 && (
        <div className="grid-container">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <h1 style={{ textAlign: "left" }}>Recent Transactions</h1>
            <div
              style={{
                width: "100%",
                backgroundColor: "white",
                borderRadius: "1rem",
                height: "100%",
              }}
            >
              {currentTransactions.map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    borderBottom: "1px solid #ccc",
                    color: "black",
                    padding: "1rem",
                  }}
                >
                  {/* Render icons based on title */}
                  {getIconForTitle(item.title)}

                  <div style={{ marginLeft: "1rem" }}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <p style={{ marginBottom: "0" }}>{item.title}</p>
                      <p style={{ marginTop: "0" }}>{item.date}</p>
                    </div>
                  </div>

                  {/* Render edit or save/cancel buttons based on edit mode */}
                  {editIndex === index ? (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        width: "100%",
                      }}
                    >
                      <div
                        style={{
                          marginLeft: "auto",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <input
                          type="number"
                          value={editedPrice}
                          onChange={(e) => setEditedPrice(e.target.value)}
                          style={{
                            width: "5rem",
                            padding: "0.5rem",
                            borderRadius: "0.5rem",
                            border: "1px solid #ccc",
                          }}
                        />
                        <button
                          style={{
                            ...buttonStyle,
                            backgroundColor: "#4caf50", 
                          }}
                          onClick={() => handleSave(index)}
                        >
                          Save
                        </button>
                        <button
                          style={{
                            ...buttonStyle,
                            backgroundColor: "#f44336", // Red color for Cancel button
                          }}
                          onClick={handleCancel}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ marginLeft: "auto" }}>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          gap: "0.2rem",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            marginRight: "4px",
                          }}
                        >
                          <FaRupeeSign />
                          <p style={{ margin: "0", marginRight: "1rem" }}>
                            {item.price}
                          </p>
                        </div>
                        <button
                          style={buttonStyle}
                          onClick={() => handleEdit(index)}
                        >
                          <CiEdit />
                        </button>
                        <button
                          style={buttonStyle}
                          onClick={() => handleRemove(index)}
                        >
                          <MdCancel />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Pagination */}
              {transactions.length > 0 && (
                <div
                  style={{
                    marginTop: "1rem",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: "1rem",
                  }}
                >
                  <button
                    style={{
                      padding: "0.3rem",
                      borderRadius: "0.5rem",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onClick={goToPrevPage}
                    disabled={currentPage === 1}
                  >
                    <BiLeftArrowAlt />
                  </button>
                  <span
                    style={{
                      margin: "0 1rem",
                      textAlign: "center",
                      color: "black",
                    }}
                  >
                    {currentPage}
                  </span>
                  <button
                    style={{
                      padding: "0.3rem",
                      borderRadius: "0.5rem",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onClick={goToNextPage}
                    disabled={endIndex >= transactions.length}
                  >
                    <BiRightArrowAlt />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <h1 style={{ textAlign: "left" }}>Top Expenses</h1>
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "1rem",
                width: "100%",
                height: "90%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  paddingLeft: "1rem",
                }}
              >
                <BarGraph data={dataForBarGraph} />
              </div>
            </div>
          </div>
        </div>
      )}
      {transactions.length === 0 && (
        <h1 style={{ textAlign: "center" }}>No Transactions Found</h1>
      )}
    </div>
  );
};

// Utility function to render icons based on title
const getIconForTitle = (title) => {
  switch (title.toLowerCase()) {
    case "meal":
      return <MdOutlineFoodBank />;

    case "shopping":
      return <GiClothes />;

    case "entertainment":
      return <MdMovieCreation />;

    case "travel":
      return <FaBusSimple />;

    default:
      return <MdDisabledByDefault />; // Return default icon if no matching title found
  }
};

// Button style
const buttonStyle = {
  width: "3rem",
  height: "3rem",
  borderRadius: "1rem",
  backgroundColor: "orange",
  border: "none",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

export default Transactions;