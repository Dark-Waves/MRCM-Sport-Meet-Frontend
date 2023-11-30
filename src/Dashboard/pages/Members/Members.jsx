import AddMembers from "./AddMembers/AddMembers";
import EditMembers from "./EditMembers/EditMembers";
import { Route, Routes } from "react-router-dom";
import Overview from "./Overview/Overview";
import { useEffect, useState } from "react";
import { config } from "../../utils/config";
import axios from "axios";
import Cookies from "js-cookie";
import Loader from "../../../Components/Loader/Loader";

export default function Members() {
  const [allMembersData, setAllMembersData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const token = Cookies.get("token");
        const { data } = await axios.get(`${config.APIURI}/api/v1/members`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (data && data.membersData) {
          setAllMembersData(data.membersData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);
  console.log(allMembersData);
  return (
    <div className="Members main-content-holder">
      {loading ? (
        <Loader />
      ) : (
        <Routes>
          <Route
            index
            path="/"
            element={<Overview allMembersData={allMembersData} />}
          />
          <Route
            path="Edit"
            element={
              <EditMembers
                allMembersData={allMembersData}
                setAllMembersData={setAllMembersData}
              />
            }
          />
          <Route
            path="Add"
            element={<AddMembers setAllMembersData={setAllMembersData} />}
          />
        </Routes>
      )}
    </div>
  );
}
