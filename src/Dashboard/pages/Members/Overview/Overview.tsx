import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { State as MainState } from "../Members";
import { Button, Menu, MenuItem } from "@mui/material";
// import XLSX from "xlsx"; // Import XLSX package for Excel export
import parse from "papaparse";

const Overview: React.FC<MainState> = ({ allMembersData }) => {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => {
    const formattedRows =
      allMembersData &&
      allMembersData.map((member) => ({
        id: member.MemberID || "", // You can choose your unique identifier
        Name: member.Name || "",
        Grade: parseInt(member.Grade) || 0,
        House: member.House || "",
        // Add more fields here according to your data structure
      }));
    setRows(formattedRows ? formattedRows : []);
  }, [allMembersData]);

  const columns: GridColDef[] = [
    { field: "id", headerName: "Member ID", width: 150 },
    { field: "Name", headerName: "Name", width: 200 },
    { field: "Grade", headerName: "Grade", width: 150 },
    { field: "House", headerName: "House", width: 150 },
    // Add more columns as needed based on your data structure
  ];

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // const exportAsExcel = () => {
  //   const formattedData = allMembersData && allMembersData.map((member) => ({
  //     id: member.MemberID || "",
  //     Name: member.Name || "",
  //     Grade: parseInt(member.Grade) || 0,
  //     House: member.House || "",
  //     // Add more fields here according to your data structure
  //   }));

  //   const worksheet = XLSX.utils.json_to_sheet(formattedData);
  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, "MembersData");

  //   // Save the file
  //   XLSX.writeFile(workbook, "members_data.xlsx");
  // };

  const exportAsJson = () => {
    const formattedData = JSON.stringify(allMembersData, null, 2);
    const blob = new Blob([formattedData], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "members_data.json";
    a.click();
    URL.revokeObjectURL(url);
    handleClose();
  };

  const exportAsCSV = () => {
    const formattedData =
      allMembersData &&
      allMembersData.map((member) => ({
        MemberID: member.MemberID || "",
        Name: member.Name || "",
        Grade: parseInt(member.Grade) || 0,
        House: member.House || "",
        // Add more fields here according to your data structure
      }));

    const csv = parse.unparse(formattedData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "members_data.csv";
    a.click();
    URL.revokeObjectURL(url);
    handleClose();
  };

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        overflowX: "hidden",
        maxHeight: "1250px",
      }}
    >
      <div className="member_overview_top m-b-4">
        <Button
          id="basic-button"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
          className="button"
          variant="contained"
        >
          Export
        </Button>

        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem onClick={exportAsCSV}>CSV</MenuItem>
          <MenuItem onClick={exportAsJson}>JSON</MenuItem>
        </Menu>
      </div>

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
