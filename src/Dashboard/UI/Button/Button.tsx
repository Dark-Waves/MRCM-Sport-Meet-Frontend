import React from "react";
import "./Button.css"; // Import your CSS file for styling
import Button2 from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";

interface ButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  color?:
    | "inherit"
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "info"
    | "warning";
  type?: "button" | "submit" | "reset" | undefined;
  className?: string; // Changed empty string to 'string' type
  variant?: "text" | "outlined" | "contained";
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  style?: React.CSSProperties
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  color = "primary", // Default value for btnType
  type = "button", // Default value for type
  className = "", // Default value for className
  variant = "contained", // Default value for variant
  startIcon,
  endIcon,
  disabled = false,
  loading = false,
  style
}: ButtonProps) => {
  return (
    <LoadingButton
      disabled={disabled}
      variant={variant}
      type={type}
      onClick={onClick}
      startIcon={startIcon}
      endIcon={endIcon}
      color={color}
      className={`button ${className} button`}
      loading={loading}
      style={style}
    >
      {children}
    </LoadingButton>
  );
};

export default Button;
