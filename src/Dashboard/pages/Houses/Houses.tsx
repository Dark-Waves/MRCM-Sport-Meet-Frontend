import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { config } from "../../utils/config";
import Cookies from "js-cookie";
import { useSnackbar } from "notistack";
import "./Houses.css";
import Loader from "../../../Components/Loader/Loader";
import { TextField } from "@mui/material";
import Button from "../../UI/Button/Button";
import DashboardContext from "../../../context/DashboardContext";
import { State } from "../../Dashboard";
interface House {
  _id: string;
  Name: string;
  description: string;
}

export default function Houses(): JSX.Element {
  const [allHousesData, setAllHousesData] = useState<House[]>([]);
  const { enqueueSnackbar } = useSnackbar();
  const { profile } = useContext<State>(DashboardContext);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editedHouse, setEditedHouse] = useState<House | null>(null);
  const [createForm, setCreateForm] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [progress, setProgress] = useState<boolean>(false);

  console.log(profile && profile.role);

  useEffect(() => {
    const getData = async () => {
      try {
        const token = Cookies.get("token");
        const response = await axios.get<{ HouseData: House[] }>(
          `${config.APIURI}/api/v1/houses`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
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

  const handleInputChanges = (field: keyof House, value: string) => {
    if (editedHouse) {
      setEditedHouse(
        (prev) =>
          ({
            ...prev,
            [field]: value, // Error occurs here due to type inference
          } as House)
      ); // Type assertion to ensure the resulting object is of type House
    }
  };

  const handleEdit = (index: number) => {
    setEditIndex(index);
    setEditedHouse({ ...allHousesData[index] });
  };

  const handleOk = async (e: React.FormEvent<HTMLFormElement>) => {
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

  const handleCreateHouse = async (
    e: React.FormEvent<HTMLFormElement>,
    houseData: House
  ) => {
    e.preventDefault();
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
        setAllHousesData((prevData) => [...prevData, response.data.houseData]);
        enqueueSnackbar("House created successfully.", { variant: "success" });
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        enqueueSnackbar(error.response.data.message, { variant: "error" });
      }
      console.error("Error creating house:", error);
    }
  };

  const handleUpdateHouse = async (updatedHouseData: House) => {
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

  const handleRemoveHouse = async (MemberID: string) => {
    try {
      const token = Cookies.get("token");
      const response = await axios.delete(
        `${config.APIURI}/api/v1/house/${MemberID}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.message === "ok") {
        const updatedHouses = allHousesData.filter(
          (house) => house._id !== MemberID
        );
        setAllHousesData(updatedHouses);
        enqueueSnackbar("House removed successfully.", { variant: "success" });
      }
    } catch (error) {
      console.error("Error removing house:", error);
    }
  };

  const handleResetHouse = async (MemberID: string) => {
    if (profile?.role !== "owner") {
      return enqueueSnackbar("You don't have access.", { variant: "error" });
    }
    try {
      const token = Cookies.get("token");
      const response = await axios.post(
        `${config.APIURI}/api/v1/house/${MemberID}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.message === "ok") {
        enqueueSnackbar("House reset successfully.", { variant: "success" });
      }
    } catch (error) {
      console.error("Error removing house:", error);
    }
  };

  return (
    <div className="houses__container position-relative h-full">
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="houses_add flex-row m-t-5 p-4">
            <Button
              variant="outlined"
              className="m-4 p-4 button"
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
                  if (editedHouse) handleCreateHouse(e, editedHouse); // Pass event and editedHouse to handleCreateHouse
                }}
                className="inputs w-full"
              >
                <div className="feild_container flex-col-center p-4 g-3 w-full">
                  <div className="input_fields w-full flex-row g-5">
                    <TextField
                      fullWidth
                      id="Name"
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
                  <div className="houses_submit_btn m-auto p-t-4">
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
                <div className="house__container" key={index}>
                  <form
                    onSubmit={handleOk}
                    className="house__content content grid-common m-4 flex-col"
                  >
                    <div className="data-content inputs w-full p-4 g-3">
                      {editIndex === index ? (
                        <>
                          {/* <span className="font-md p-3 bg-primary rounded-md font-weight-500">
                            Name: {house.Name}
                          </span> */}
                          <TextField
                            id="Name"
                            type="text"
                            placeholder="Name"
                            value={
                              (editedHouse && editedHouse.Name) ||
                              house.Name ||
                              ""
                            }
                            onChange={(e) => (
                              e.preventDefault(),
                              handleInputChanges("Name", e.target.value)
                            )}
                            required
                          />

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
                        className="button"
                        color="error"
                        variant="outlined"
                        onClick={() => handleRemoveHouse(house._id)}
                      >
                        Remove
                      </Button>
                      {profile?.role === "owner" && (
                        <Button
                          className="button"
                          color="warning"
                          variant="text"
                          onClick={() => handleResetHouse(house._id)}
                        >
                          Reset
                        </Button>
                      )}
                      {editIndex === index ? (
                        <>
                          <Button
                            className="button"
                            variant="contained"
                            type="submit"
                          >
                            OK
                          </Button>
                          <Button
                            className="button"
                            color="primary"
                            variant="text"
                            onClick={handleCancel}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Button
                          className="button"
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
              <h2>{"We can't find any houses"}</h2>
            </div>
          )}
        </>
      )}
    </div>
  );
}
