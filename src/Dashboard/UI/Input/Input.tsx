import React from "react";
// import "./Input.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface InputProps {
  type: string;
  label?: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  textarea?: boolean;
  placeholder?: string;
  rows?: number;
  className?: string;
  icon?: IconDefinition; // Updated interface to include icon-related props
  iconTitle?: string;
  required: boolean;
  name: string;
  id: string;
}

const Input: React.FC<InputProps> = ({
  type,
  label,
  value,
  onChange,
  textarea,
  placeholder,
  rows,
  className,
  icon,
  iconTitle,
  required,
  name,
  id,
}) => {
  const InputComponent = textarea ? "textarea" : "input";

  return (
    <div className={`input-container position-relative ${className}`}>
      {label && <label htmlFor={label}>{label}</label>}
      <InputComponent
        type={type}
        id={label || id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        required={required}
        name={name}
      />
      {icon && (
        <FontAwesomeIcon
          className="position-absolute"
          style={{ right: "18px", top: "28%" }}
          icon={icon}
          title={iconTitle}
        />
      )}{" "}
      {/* Display icon if provided */}
    </div>
  );
};

export default Input;
