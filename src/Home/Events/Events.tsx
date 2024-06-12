import React, { useContext } from "react";
import HomeContext from "../../context/HomeContext";
import { Box } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

interface EventData {
  _id: string;
  name: string;
  description: string;
  types: {
    _id: string;
    option: string;
    selection: string;
  }[];
  state: string;
  places: any[];
}

const Events: React.FC = () => {
  const { state } = useContext(HomeContext);
  console.log(state.eventData);
  const columns: GridColDef[] = [
    { field: "id", headerName: "House ID", width: 150, type: "number" },
    { field: "name", headerName: "Name", width: 200 },
    { field: "state", headerName: "State", width: 200 },
  ];

  // Transform memberData to match the DataGrid's expected format
  const rows = state.eventData
    ? state.eventData.map((data: EventData, index) => ({ id: index, ...data }))
    : [];

  return (
    <div className="table-events m-t-8 p-t-8">
      <Box sx={{ height: "100%", width: "100%" }}>
        <DataGrid rows={rows} columns={columns} />
      </Box>
    </div>
  );
};

export default Events;
