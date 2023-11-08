import { useContext, useEffect, useRef } from "react";
import UploaderContext from "./Context/UploaderContext";
import { v4 as uuidv4 } from "uuid";
export default function UploadButton({ children }) {
  const { onAdd, uploadButtonProps } = useContext(UploaderContext);
  const onAddRef = useRef(null);
  useEffect(
    function () {
      onAddRef.current = onAdd;
    },
    [onAdd]
  );
  const onAddF = function (file) {
    const data = {
      file,
      uid: Date.now() + uuidv4(),
      status: "none",
      progress: 0,
      errorName: null,
      serverResponse: null,
    };
    onAddRef.current && onAddRef.current(data);
  };

  const handleButtonClick = () => {
    // Trigger the file input click event
    const fileInput = document.querySelector("#fileUploader");
    fileInput.click();
  };
  const handleChange = function (e) {
    for (const file of e.target.files) {
      onAddF(file);
    }
  };

  return (
    <div className="upload_button_container flex-col">
      <label className="upload_button" onClick={handleButtonClick}>
        {children}
      </label>
      <input
        type="file"
        name="file"
        id="fileUploader"
        multiple // Enable multiple file selection
        onChange={handleChange} // Pass the selected files to onAddF
      />
    </div>
  );
}
