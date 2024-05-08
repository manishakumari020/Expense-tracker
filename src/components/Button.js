import React from "react";

import { FaRupeeSign } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";

const Button = ({
  walletBalance,
  Heading,
  Type,
  colorForMoney,
  gradientForButton,
  onClick,
}) => {
  return (
    <div
      style={{
        background: "rgba(155, 155, 155, 1)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "auto",
        height: "auto",
        borderRadius: "1rem",
        padding: "2rem",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <h2>{Heading}:</h2>
        <h2
          style={{
            color: `${colorForMoney}`,
            display: "flex",
            alignItems: "center",
          }}
        >
          <FaRupeeSign />
          {walletBalance}
        </h2>
      </div>

      <button
        style={{
          background: `${gradientForButton}`,
          padding: "0.5rem 1rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "1rem",
          border: "none",
          color: "white",
          cursor: "pointer",
          gap: "0.5rem",
        }}
        onClick={onClick}
      >
        <IoMdAdd /> {Type} Money
      </button>
    </div>
  );
};

export default Button;