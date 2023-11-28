import React from "react";
import "./Button.css"; // Import your CSS file for styling
import Button2 from "@mui/material/Button";

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  btnType:
    | "inherit"
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "info"
    | "warning";
  type: "button" | "submit" | "reset" | undefined;
  className: "";
  variant: "text" | "outlined" | "contained";
  startIcon: React.ReactNode;
  endIcon: React.ReactNode;
  disabled: boolean;
}

export default function Button({
  onClick,
  children,
  btnType,
  type,
  className,
  variant,
  startIcon,
  endIcon,
  disabled,
}: ButtonProps) {
  return (
    <Button2
      fullWidth
      disabled={disabled}
      variant={variant}
      type={type}
      onClick={onClick}
      startIcon={startIcon}
      endIcon={endIcon}
      color={btnType}
      className={`button ${className}`}
    >
      {children}
    </Button2>
  );
}
