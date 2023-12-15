import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { State as MainState } from "../Members";

const Overview: React.FC<MainState> = ({ allMembersData }) => {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => {
    const formattedRows =
      allMembersData &&
      allMembersData.map((member) => ({
        id: member.HouseID || "", // You can choose your unique identifier
        Name: member.Name || "",
        Grade: parseInt(member.Grade) || 0,
        House: member.House || "",
        // Add more fields here according to your data structure
      }));
    setRows(formattedRows ? formattedRows : []);
  }, [allMembersData]);

  const columns: GridColDef[] = [
    { field: "id", headerName: "Admission ID", width: 150 },
    { field: "Name", headerName: "Name", width: 200 },
    { field: "Grade", headerName: "Grade", width: 150 },
    { field: "House", headerName: "House", width: 150 },
    // Add more columns as needed based on your data structure
  ];
  console.log(rows);
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
        checkboxSelection
        disableRowSelectionOnClick={true}
      />
    </Box>
  );
};
export default Overview;
