import { useEffect, useState } from "react";
import { parse } from "papaparse"; // for parsing CSV files, you might need another library for XLSX
import axios from "axios";
import { config } from "../../../utils/config";
import Cookies from "js-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function AddMembers() {
  const [membersData, setMembersData] = useState([]);
  const [submitErrors, setSubmitErrors] = useState([]);
  useEffect(() => {
    console.log(membersData);
  }, [membersData]);
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      parse(file, {
        header: true,
        complete: (parsedData) => {
          setMembersData(parsedData.data);
        },
        error: (err) => {
          console.error(err);
        },
      });
    }
  };

  const handleAddManually = () => {
    // Add logic to manually add member data
  };

  const handleSubmit = async () => {
    try {
      const token = Cookies.get("token");
      // Send membersData to API for submission
      // Assuming an API call like axios.post('/api/addMembers', membersData)
      // This is a placeholder; replace it with your API endpoint
      const response = await axios.put(
        `${config.APIURI}/api/v1/members/add`,
        { members: membersData },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Handle response errors
      if (response.data.error) {
        setSubmitErrors(response.data.data);
        console.log(response.data.data);
      }
      if (response.data.message === "ok") {
        console.log(response.data);
      }
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  const [showAddManualPopup, setShowAddManualPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);

  const openAddManualPopup = () => {
    setShowAddManualPopup(true);
  };

  const closeAddManualPopup = () => {
    setShowAddManualPopup(false);
  };

  const openEditPopup = () => {
    setShowEditPopup(true);
  };

  const closeEditPopup = () => {
    setShowEditPopup(false);
  };

  const handleRemove = (index) => {
    const updatedMembersData = [...membersData];
    updatedMembersData.splice(index, 1);
    setMembersData(updatedMembersData);
  };
  const [editedIndex, setEditedIndex] = useState(null);

  const handleEdit = (index) => {
    setEditedIndex(index);
    openEditPopup();
  };

  const handleUpdate = (updatedData) => {
    const updatedMembersData = [...membersData];
    updatedMembersData[editedIndex] = updatedData;
    setMembersData(updatedMembersData);
    setEditedIndex(null);
    closeEditPopup();
  };
  const handleManualAddition = (data) => {
    setMembersData([...membersData, data]);
    closeAddManualPopup();
  };

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
      <button onClick={handleAddManually}>Add Manually</button>

      {/* Display table of membersData */}
      {/* Map through membersData to display rows */}
      {membersData.map((member, index) => (
        <div key={index} className="grid-common m-4 flex-col">
          <div className="user-content">
            <div className="data-content">
              <span className="font-md font-weight-500">{member.name}</span>
              <span className="font-md font-weight-500">{member.grade}</span>
              <span className="font-md font-weight-500">{member.house}</span>
              <span className="font-md font-weight-500">
                {member.admissionID}
              </span>
              {submitErrors.length > 0 &&
                submitErrors.find(
                  (value) => value.data === member.admissionID
                ) && (
                  <div
                    className="status"
                    title={
                      submitErrors.find(
                        (value) => value.data === member.admissionID
                      )?.message
                    }
                  >
                    {submitErrors.find(
                      (value) => value.data === member.admissionID
                    )?.message === "approved" ? (
                      <FontAwesomeIcon
                        title={data.state}
                        icon={faCircleCheck}
                      />
                    ) : data.state === "rejected" ? (
                      <FontAwesomeIcon
                        title={data.state}
                        icon={faCircleXmark}
                      />
                    ) : data.state === "pending" ? (
                      <FontAwesomeIcon title={data.state} icon={faCircle} />
                    ) : (
                      <FontAwesomeIcon title={data.state} icon={faHourglass} />
                    )}
                  </div>
                )}
            </div>
          </div>
          <div className="buttons flex-row-center g-4">
            <button
              onClick={() => handleRemove(index)}
              className="p-t-4 p-b-4 p-r-3 p-l-3 bg-scarlet-1 rounded-md font-weight-600 font-md"
            >
              Remove
            </button>
            <button
              onClick={() => handleEdit(index)}
              className="p-t-4 p-b-4 p-r-3 p-l-3 bg-primary rounded-md font-weight-600 font-md"
            >
              Edit
            </button>
          </div>
        </div>
      ))}

      <button onClick={handleSubmit}>Submit</button>

      {/* Display error messages */}
      {submitErrors.length > 0 && (
        <div>
          <h3>Submission Errors:</h3>
          <ul>
            {submitErrors.map((error) => (
              <li key={error.tempId}>
                Error for ID: {error.tempId} - {error.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {showEditPopup && (
        <div className="popup">
          <div className="popup-content">
            <span className="close-popup" onClick={closeEditPopup}>
              &times;
            </span>
            {/* Implement your input fields pre-filled with existing data for editing */}
            {/* Example: */}
            <input type="text" defaultValue={membersData[editedIndex]?.name} />
            {/* Add other input fields pre-filled with respective data */}
            <button onClick={handleUpdate}>Update</button>
          </div>
        </div>
      )}

      {showAddManualPopup && (
        <div className="popup">
          <div className="popup-content">
            <span className="close-popup" onClick={closeAddManualPopup}>
              &times;
            </span>
            {/* Implement your input fields for manual data addition */}
            {/* Example: */}
            <input type="text" placeholder="Name" />
            {/* Add other input fields for grade, house, admission ID */}
            <button onClick={handleManualAddition}>Add Member</button>
          </div>
        </div>
      )}
    </div>
  );
}
