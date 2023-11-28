import { useEffect, useState } from "react";
import axios from "axios";
import { config } from "../../utils/config";
import Cookies from "js-cookie";
import Input from "../../UI/Input/Input";
import Button from "../../UI/Button/Button";
import { useSnackbar } from "notistack";
import "./Houses.css";
import Loader from "../../../Components/Loader/Loader";
import { TextField } from "@mui/material";

export default function Houses() {
  const [allHousesData, setAllHousesData] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [editIndex, setEditIndex] = useState(null);
  const [editedHouse, setEditedHouse] = useState(null);
  const [createForm, setCreateForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const token = Cookies.get("token");
        const response = await axios.get(`${config.APIURI}/api/v1/houses`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data) {
          setLoading(false);
          setAllHousesData(response.data.HouseData);
        }
      } catch (error) {
        setLoading(false);
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  const handleInputChanges = (field, value) => {
    setEditedHouse((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditedHouse({ ...allHousesData[index] });
  };

  const handleOk = async (e) => {
    e.preventDefault();
    if (editedHouse) {
      await handleUpdateHouse(editedHouse);
      setEditedHouse(null);
    }
    setEditIndex(null);
  };

  const handleCancel = () => {
    setEditIndex(null);
    setEditedHouse(null);
  };

  const setCreateNew = () => {
    setCreateForm(true);
  };

  const handleCreateHouse = async (e, houseData) => {
    console.log(houseData);
    try {
      const token = Cookies.get("token");
      const response = await axios.put(
        `${config.APIURI}/api/v1/house/add`,
        { houseData },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.message === "ok") {
        setCreateForm(false);
        setAllHousesData((prevData) => [...prevData, houseData]);
        enqueueSnackbar("House created successfully.", { variant: "success" });
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        enqueueSnackbar(error.response.data.message, { variant: "error" });
      }
      console.error("Error creating house:", error);
    }
  };

  const handleUpdateHouse = async (updatedHouseData) => {
    console.log(updatedHouseData);
    try {
      const token = Cookies.get("token");
      const response = await axios.patch(
        `${config.APIURI}/api/v1/house/${updatedHouseData._id}`,
        { updatedHouseData },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.message === "ok") {
        const updatedHouses = allHousesData.map((house) =>
          house._id === updatedHouseData._id ? updatedHouseData : house
        );
        setAllHousesData(updatedHouses);
        enqueueSnackbar("House updated successfully.", { variant: "success" });
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        enqueueSnackbar(error.response.data.message, { variant: "error" });
      }
      console.error("Error updating house:", error);
    }
  };

  const handleRemoveHouse = async (houseId) => {
    try {
      const token = Cookies.get("token");
      const response = await axios.delete(
        `${config.APIURI}/api/v1/house/${houseId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.message === "ok") {
        const updatedHouses = allHousesData.filter(
          (house) => house._id !== houseId
        );
        setAllHousesData(updatedHouses);
        enqueueSnackbar("House removed successfully.", { variant: "success" });
      }
    } catch (error) {
      console.error("Error removing house:", error);
    }
  };

  return (
    <div className="houses__container">
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="houses_add flex-row-center m-t-5 p-4">
            <Button
              variant="outlined"
              className="m-4 p-4 "
              onClick={setCreateNew}
            >
              Create New
            </Button>
          </div>
          {createForm && (
            <div className="create_house grid-common m-4 flex-col position-relative">
              <form
                onSubmit={(e) => {
                  e.preventDefault(); // Prevent default form submission behavior
                  handleCreateHouse(e, editedHouse); // Pass event and editedHouse to handleCreateHouse
                }}
                className="inputs w-full"
              >
                <div className="feild_container flex-col-center p-4 g-3 w-full">
                  <div className="input_fields w-full flex-row g-5">
                    <TextField
                      fullWidth
                      id="name"
                      type="text"
                      label="Name"
                      onChange={(e) => (
                        e.preventDefault(),
                        handleInputChanges("Name", e.target.value)
                      )}
                      required
                    />
                    <TextField
                      fullWidth
                      id="description"
                      type="text"
                      label="Description"
                      onChange={(e) => (
                        e.preventDefault(),
                        handleInputChanges("description", e.target.value)
                      )}
                    />
                  </div>
                  <div className="houses_submit_btn w-full">
                    <Button type="submit" variant="contained">
                      Create
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          )}
          {allHousesData.length ? (
            <>
              {allHousesData.map((house, index) => (
                <div className="house__container" key={house._id}>
                  <form
                    onSubmit={handleOk}
                    className="house__content content grid-common m-4 flex-col"
                  >
                    <div className="data-content inputs w-full p-4 g-3">
                      {editIndex === index ? (
                        <>
                          <span className="font-md p-3 bg-primary rounded-md font-weight-500">
                            Name: {house.Name}
                          </span>
                          <TextField
                            id="description"
                            type="text"
                            placeholder="Description"
                            value={
                              (editedHouse && editedHouse.description) ||
                              house.description ||
                              ""
                            }
                            onChange={(e) => (
                              e.preventDefault(),
                              handleInputChanges("description", e.target.value)
                            )}
                            required
                          />
                        </>
                      ) : (
                        <>
                          <span
                            onClick={() => handleEdit(index)}
                            className="font-md p-3 bg-primary rounded-md font-weight-500"
                          >
                            Name: {house.Name}
                          </span>
                          <span
                            onClick={() => handleEdit(index)}
                            className="font-md p-3 bg-primary rounded-md font-weight-500"
                          >
                            Description: {house.description}
                          </span>
                        </>
                      )}
                    </div>
                    <div className="house__buttons buttons flex-row-center g-4">
                      <Button
                      className="houses_submit_btn"
                        btnType="error"
                        variant="outlined"
                        onClick={() => handleRemoveHouse(house._id)}
                      >
                        Remove
                      </Button>
                      {editIndex === index ? (
                        <>
                          <Button
                          className="houses_submit_btn" variant="contained" type="submit">
                            OK
                          </Button>
                          <Button
                          className="houses_submit_btn"
                            btnType="primary"
                            variant="text"
                            onClick={handleCancel}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Button
                        className="houses_submit_btn"
                          variant="contained"
                          onClick={() => handleEdit(index)}
                        >
                          Edit
                        </Button>
                      )}
                    </div>
                  </form>
                </div>
              ))}
            </>
          ) : (
            <div className="empty_houses">
              <h2>We can't find any houses</h2>
            </div>
          )}
        </>
      )}
    </div>
  );
}
