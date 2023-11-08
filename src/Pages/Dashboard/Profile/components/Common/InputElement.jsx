import { useEffect } from "react";

export default function InputElement({
  id,
  value,
  handleInputChange,
  rows = 1,
  name,
}) {
  useEffect(
    function () {
      const element = document.querySelector(`#${id}-account-form-group`);
      const inputElement = document.querySelector(
        `#${id}-account-form-group-input`
      );
      if (value) element.classList.add("not-empty");
      if (!(document.activeElement === inputElement) && !value)
        element.classList.remove("not-empty");
    },
    [value, id]
  );
  return (
    <div id={`${id}-account-form-group`} className="form-group">
      <label>{name}</label>
      {rows === 1 && (
        <input
          id={`${id}-account-form-group-input`}
          type="text"
          className="form-control"
          rows={rows}
          value={value}
          onChange={(e) => handleInputChange(id, e.target.value)}
          onFocus={(e) => {
            e.target.parentNode.classList.add("focus");
            e.target.parentNode.classList.add("not-empty");
          }}
          onBlur={(e) => {
            e.target.parentNode.classList.remove("focus");
            if (!value) e.target.parentNode.classList.remove("not-empty");
          }}
        />
      )}
      {rows !== 1 && (
        <textarea
          id={`${id}-account-form-group-input`}
          type="text"
          className="form-control"
          rows={rows}
          value={value}
          onChange={(e) => handleInputChange(id, e.target.value)}
          onFocus={(e) => {
            e.target.parentNode.classList.add("focus");
            e.target.parentNode.classList.add("not-empty");
          }}
          onBlur={(e) => {
            e.target.parentNode.classList.remove("focus");
            if (!value) e.target.parentNode.classList.remove("not-empty");
          }}
        />
      )}
    </div>
  );
}
