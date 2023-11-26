import React, { ReactNode } from 'react';
import './PopUp.css'; // Import your CSS file for styling

interface PopUpProps {
  closePopup: () => void;
  children: ReactNode;
}

const PopUp: React.FC<PopUpProps> = ({ closePopup, children }) => {
  return (
    <div className="popup">
      <div className="popup-content">
        <span className="close-popup" onClick={closePopup}>
          &times;
        </span>
        {children}
      </div>
    </div>
  );
};

export default PopUp;
