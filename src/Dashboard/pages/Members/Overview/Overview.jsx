import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import Cookies from "js-cookie";
import { config } from "../../../utils/config";

export default function Overview() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const token = Cookies.get("token");
        const { data } = await axios.get(`${config.APIURI}/api/v1/members`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (data && data.membersData) {
          const formattedRows = data.membersData.map((member) => ({
            id: member.admissionID || "", // You can choose your unique identifier
            Name: member.Name || "",
            Grade: parseInt(member.Grade) || "",
            House: member.House || "",
            // Add more fields here according to your data structure
          }));
          setRows(formattedRows);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getData();
  }, []);

  const columns = [
    { field: "id", headerName: "Admission ID", width: 150 },
    { field: "Name", headerName: "Name", width: 200 },
    { field: "Grade", headerName: "Grade", width: 150 },
    { field: "House", headerName: "House", width: 150 },
    // Add more columns as needed based on your data structure
  ];

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        overflowX: "hidden",
        maxHeight: "1250px",
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        checkboxSelection
        disableSelectionOnClick
      />
    </Box>
  );
}
