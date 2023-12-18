import React, { FC, useContext } from "react";
import { State } from "../Home";
import HomeContext from "../../context/HomeContext";
import { Box } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

// Define interface for member data
interface MemberData {
  _id: string;
  Name: string;
  House: string;
  Grade: string;
  MemberID: number;
}

export const Members: FC = () => {
  const { memberData }: State = useContext(HomeContext);
  console.log(memberData);

  // Define columns based on the data structure
  const columns: GridColDef[] = [
    { field: "MemberID", headerName: "House ID", width: 150, type: "number" },
    { field: "Name", headerName: "Name", width: 200 },
    { field: "House", headerName: "House", width: 200 },
    { field: "Grade", headerName: "Grade", width: 150 },
  ];

  // Transform memberData to match the DataGrid's expected format
  const rows = memberData ? memberData.map((data: MemberData) => ({ id: data._id, ...data })) : [];

  return (
    <div className="table-members m-t-8 p-t-8">
      <Box sx={{ height: "100%", width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          
        />
      </Box>
    </div>
  );
};
