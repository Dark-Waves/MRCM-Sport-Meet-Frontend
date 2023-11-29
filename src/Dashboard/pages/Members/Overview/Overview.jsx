import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
export default function Overview({ allMembersData }) {
  const [rows, setRows] = useState([]);

  useEffect(() => {
      const formattedRows = allMembersData.map((member) => ({
        id: member.AdmissionID || "", // You can choose your unique identifier
        Name: member.Name || "",
        Grade: parseInt(member.Grade) || "",
        House: member.House || "",
        // Add more fields here according to your data structure
      }));
      setRows(formattedRows);
  }, [allMembersData]);

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
