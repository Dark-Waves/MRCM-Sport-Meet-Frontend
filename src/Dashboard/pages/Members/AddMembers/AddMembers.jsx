import { useState } from "react";
import { parse } from "papaparse";
import axios from "axios";
import { config } from "../../../utils/config";
import Cookies from "js-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";
import Button from "../../../UI/Button/Button";
import Input from "../../../UI/Input/Input";

export default function AddMembers() {
  const [membersData, setMembersData] = useState([]);
  const [submitErrors, setSubmitErrors] = useState([]);
  const [emptyErrors, setEmptyErrors] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [newMember, setNewMember] = useState({});
  const [createNew, setCreateNew] = useState(false);

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

  const handleSubmit = async () => {
    try {
      const emptyIndexes = [];
      const isEmptyRow = membersData.some((member, index) => {
        const isEmpty =
          !member.name || !member.grade || !member.house || !member.admissionID;
        if (isEmpty) {
          emptyIndexes.push(index);
        }
        return isEmpty;
      });

      if (isEmptyRow) {
        const emptyErrors = membersData.map((_, index) => {
          return emptyIndexes.includes(index)
            ? {
                message: "Empty fields. Please fill in all required fields.",
                error: true,
              }
            : {
                message: "",
                error: false,
              };
        });

        setEmptyErrors(emptyErrors);
        console.log(emptyErrors);
        return;
      }

      const token = Cookies.get("token");
      const response = await axios.put(
        `${config.APIURI}/api/v1/members/add`,
        { members: membersData },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.error) {
        setSubmitErrors(response.data.data);
        console.log(response.data.data);
      }
      if (response.data.message === "ok") {
        console.log(response.data);
        setMembersData([])
        setEmptyErrors([])
        setEditIndex(null)
        setNewMember({})
        setCreateNew(false)      
        setSubmitErrors([]);
      }
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  // functions
  const handleRemove = (index) => {
    const updatedMembersData = [...membersData];
    updatedMembersData.splice(index, 1);
    setMembersData(updatedMembersData);
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setEmptyErrors((prevEmptyErrors) => {
      const updatedEmptyErrors = [...prevEmptyErrors];
      updatedEmptyErrors[index] = { message: "", error: false };
      return updatedEmptyErrors;
    });
  };

  const handleOk = () => {
    setEditIndex(null);
  };

  const handleCancel = () => {
    setEditIndex(null);
  };

  const handleInputChanges = (e, index) => {
    const { id, value } = e.target;
    const updatedMembersData = [...membersData];
    updatedMembersData[index][id] = value;
    setMembersData(updatedMembersData);
  };

  const addCreateNew = () => {
    setMembersData([newMember, ...membersData]);
    setCreateNew(false);
    setNewMember({});
  };

  const clearCreateNew = () => {
    setCreateNew(false);
    setNewMember({});
  };

  console.log(membersData);
  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
      <Button onClick={() => setCreateNew(true)}>Create New</Button>
      <Button onClick={handleSubmit}>Submit</Button>

      {createNew && (
        <div>
          <form onSubmit={addCreateNew}>
            <div className="inputs flex-row w-full p-4 g-3">
              <Input
                type="text"
                placeholder="Name"
                onChange={(e) =>
                  setNewMember({ ...newMember, name: e.target.value })
                }
                required
              />
              <Input
                type="text"
                placeholder="Grade"
                onChange={(e) =>
                  setNewMember({ ...newMember, grade: e.target.value })
                }
                required
              />
              <Input
                type="text"
                placeholder="AdmissionID"
                onChange={(e) =>
                  setNewMember({ ...newMember, admissionID: e.target.value })
                }
                required
              />
              <Input
                type="text"
                placeholder="House"
                onChange={(e) =>
                  setNewMember({ ...newMember, house: e.target.value })
                }
                required
              />
            </div>
            <Button type="submit">OK</Button>
            <Button btnType="primary" onClick={clearCreateNew}>
              Cancel
            </Button>
          </form>
        </div>
      )}
      {membersData.map((member, index) => (
        <div className="div" key={index}>
          <div className="content grid-common m-4 flex-col">
            <div className="user-content">
              <div className="data-content inputs flex-row w-full p-4 g-3">
                {editIndex === index ? (
                  <>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Name"
                      value={member.name || ""}
                      onChange={(e) => handleInputChanges(e, index)}
                      required
                    />
                    <Input
                      id="grade"
                      type="text"
                      placeholder="Grade"
                      value={member.grade || ""}
                      onChange={(e) => handleInputChanges(e, index)}
                      required
                    />
                    <Input
                      id="admissionID"
                      type="text"
                      placeholder="AdmissionID"
                      value={member.admissionID || ""}
                      onChange={(e) => handleInputChanges(e, index)}
                      required
                    />
                    <Input
                      id="house"
                      type="text"
                      placeholder="House"
                      value={member.house || ""}
                      onChange={(e) => handleInputChanges(e, index)}
                      required
                    />
                  </>
                ) : (
                  <>
                    <span className="font-md font-weight-500">
                      {member.name}
                    </span>
                    <span className="font-md font-weight-500">
                      {member.grade}
                    </span>
                    <span className="font-md font-weight-500">
                      {member.house}
                    </span>
                    <span className="font-md font-weight-500">
                      {member.admissionID}
                    </span>
                  </>
                )}

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
                      <FontAwesomeIcon icon={faCircleXmark} />
                    </div>
                  )}

                {emptyErrors[index]?.error && (
                  <div className="status" title={emptyErrors[index]?.message}>
                    <FontAwesomeIcon icon={faCircleXmark} />
                  </div>
                )}
              </div>
            </div>
            <div className="buttons flex-row-center g-4">
              <>
                <Button
                  btnType="danger"
                  onClick={() => handleRemove(index)}
                  className="bg-scarlet-1 rounded-md font-weight-600 font-md"
                >
                  Remove
                </Button>
                {editIndex === index ? (
                  <>
                    <Button
                      onClick={handleOk}
                      className="bg-primary rounded-md font-weight-600 font-md"
                    >
                      OK
                    </Button>
                    <Button
                      btnType="primary"
                      onClick={handleCancel}
                      className="bg-secondary rounded-md font-weight-600 font-md"
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => handleEdit(index)}
                    className="bg-primary rounded-md font-weight-600 font-md"
                  >
                    Edit
                  </Button>
                )}
              </>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
