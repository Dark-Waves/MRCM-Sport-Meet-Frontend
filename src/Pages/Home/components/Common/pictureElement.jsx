import { useEffect, useState } from "react";

export default function PictureElement({
  id,
  value,
  handleInputChange,
  defaultPicture,
}) {
  const handleChange = function (e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async function () {
      handleInputChange(id, reader.result);
    };
  };
  return (
    <div className="profile-picture">
      <img src={value || defaultPicture} alt="Image" className="preview" />
      <label className="overlay-profile-picture">Choose Photo</label>
      <input
        type="file"
        accept="image/*"
        name=""
        className="input"
        onChange={handleChange}
      />
    </div>
  );
}
