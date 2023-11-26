import React from "react";
import "./Button.css"; // Import your CSS file for styling

type ButtonType = "primary" | "secondary" | "danger" | "custom"; // Define the types for btnType

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  btnType: ButtonType; // Use the defined type for btnType
  type: "button" | "submit" | "reset" | undefined;
  className: "";
}

export default function Button({
  onClick,
  children,
  btnType,
  type,
  className,
}: ButtonProps) {
  const determineButtonType = () => {
    switch (btnType) {
      case "primary":
        return "primary-button";
      case "secondary":
        return "secondary-button";
      case "danger":
        return "danger-button";
      default:
        return "modern-button";
    }
  };

  return (
    <button
      type={type}
      className={`font-weight-600 rounded-md ${determineButtonType()} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
