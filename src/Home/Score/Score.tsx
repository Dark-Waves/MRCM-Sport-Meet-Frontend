import React, { FC, useContext, useEffect, useState } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  SelectChangeEvent,
  Collapse,
  IconButton,
  Box,
  Card,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { State } from "../Home";
import HomeContext from "../../context/HomeContext";

/**
 * Event Types Selections
 * 
 * @example     const updatedEventTypes = [...selectedEventTypes];
    const index = updatedEventTypes.findIndex(
      (item) => item.eventType === eventType
    );
 */
interface SelectedEventTypes {
  option: string;
  eventType: string;
}

interface ScoreData {
  scoreBoard: {
    eventName: string;
    eventType: {
      option: string;
    }[];
    inputType: string;
    places: {
      house: string;
      score: number;
      member: string;
      MemberID: string;
      place: number;
    }[];
  }[];
  eventTypes: {
    _id: string;
    name: string;
    options: {
      _id: string;
      option: string;
    }[];
  }[];
}

const Score: FC = () => {
  const { scoreData, houseData }: State = useContext(HomeContext);
  const [selectedEventTypes, setSelectedEventTypes] = useState<
    SelectedEventTypes[]
  >([]);
  const [filteredScores, setFilteredScores] = useState<ScoreData["scoreBoard"]>(
    scoreData?.scoreBoard || []
  );

  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const columns = [{ field: "eventName", headerName: "Event" }];

  /**
   * Handles changes in event types and manages the selectedEventTypes array.
   * @param event The event object, possibly a SelectChangeEvent<string>.
   * @param eventType A string identifying the type of event.
   * @example onChange={(event) => handleChange(event, _id)}
   */
  const handleChange = (
    event: SelectChangeEvent<string>,
    eventType: string
  ) => {
    console.log("value ", event.target.value);
    console.log("eventType ", eventType);
    // Create a copy of selectedEventTypes array to avoid direct mutation
    const updatedEventTypes = [...selectedEventTypes];
    console.log("selectedEventTypes ", selectedEventTypes);
    // Find the index of the item with the provided eventType
    const index = updatedEventTypes.findIndex(
      (item) => item.option === eventType
    );
    console.log("index ", index);
    // Check conditions for adding or removing items from the array
    if (index === -1 && event.target.value !== "") {
      // Add a new object to updatedEventTypes if eventType doesn't exist and value is not empty
      updatedEventTypes.push({ eventType, option: event.target.value });
    } else if (index !== -1 && event.target.value === "") {
      // Remove the object from updatedEventTypes if eventType exists and value is empty
      updatedEventTypes.splice(index, 1);
    }

    // Update the selectedEventTypes state with the modified array
    setSelectedEventTypes(updatedEventTypes);
  };

  const toggleRowExpansion = (index: number) => {
    const expanded = [...expandedRows];
    const rowIndex = expanded.indexOf(index);

    if (rowIndex === -1) {
      expanded.push(index);
    } else {
      expanded.splice(rowIndex, 1);
    }

    setExpandedRows(expanded);
  };

  useEffect(() => {
    if (!selectedEventTypes.length) {
      setFilteredScores(scoreData?.scoreBoard || []);
    } else {
      const selectedOptions = selectedEventTypes.flatMap(
        (selected) => selected.option
      );
      const filtered = scoreData?.scoreBoard.filter((item) =>
        item.eventType.some((event) => selectedOptions.includes(event.option))
      );

      setFilteredScores(filtered || []);
    }
  }, [scoreData, selectedEventTypes]);

  /**
   * Get Ordinal Function
   * @param number
   * @returns input number + ordinal as string
   */
  const getOrdinal = (number: number) => {
    if (number >= 11 && number <= 13) {
      return number + "th";
    }

    const lastDigit = number % 10;

    switch (lastDigit) {
      case 1:
        return number + "st";
      case 2:
        return number + "nd";
      case 3:
        return number + "rd";
      default:
        return number + "th";
    }
  };
  return (
    <div className="m-t-8 p-t-7" style={{ zIndex: 1 }}>
      {/* All data types */}
      {/* <div className="flex-row g-5 m-5 bg-second p-3 rounded">
        {scoreData &&
          scoreData.eventTypes?.map((data) => (
            <div className="option_selection w-40">
              <FormControl key={data._id} fullWidth>
                <InputLabel id={`event-type-label-${data._id}`}>
                  {data.name}
                </InputLabel>
                <Select
                  label={data.name}
                  labelId={`event-type-label-${data._id}`}
                  id={`event-type-${data._id}`}
                  value={
                    selectedEventTypes.some(
                      (selected) => selected.eventType === data._id
                    )
                      ? selectedEventTypes.find(
                          (selected) => selected.eventType === data._id
                        )?.option || ""
                      : ""
                  }
                  onChange={(event) => handleChange(event, data._id)}
                >
                  <MenuItem value="">None</MenuItem>
                  {data.options.map((eventType) => (
                    <MenuItem key={eventType._id} value={eventType._id}>
                      {eventType.option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          ))}
      </div> */}

      <div className="table-scores m-5">
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell align="center" key={column.field}>
                    {column.headerName}
                  </TableCell>
                ))}
                <TableCell align="center" colSpan={houseData?.length}>
                  Houses
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={columns.length}></TableCell>
                {houseData?.map((house, index) => (
                  <TableCell key={index}>{house.Name}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredScores.map((row, index) => (
                <React.Fragment key={index}>
                  <TableRow>
                    <TableCell>
                      {row.eventName}
                      <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => toggleRowExpansion(index)}
                      >
                        {expandedRows.includes(index) ? (
                          <KeyboardArrowUpIcon />
                        ) : (
                          <KeyboardArrowDownIcon />
                        )}
                      </IconButton>
                    </TableCell>
                    {houseData?.map((data, dataIndex) => {
                      const matchingPlace = row.places.find(
                        (place) => place.house === data.Name
                      );

                      return (
                        <TableCell key={dataIndex}>
                          {matchingPlace
                            ? `${getOrdinal(matchingPlace.place)} - ${
                                matchingPlace.member
                              }(${matchingPlace.MemberID})`
                            : "-"}
                        </TableCell>
                      );
                    })}

                    {/* Add cells for places if needed */}
                  </TableRow>
                  <TableRow>
                    <TableCell
                      style={{ paddingBottom: 0, paddingTop: 0 }}
                      colSpan={6}
                    >
                      <Collapse
                        in={expandedRows.includes(index)}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Box sx={{ margin: 1 }}>
                          <div
                            className="eventName font-md font-weight-600"
                            style={{ fontSize: 15 }}
                          >
                            {row.eventName}
                          </div>
                          <div className="flex-row g-3 font-md font-weight-500 m-b-4 m-t-4">
                            {row.eventType.map((data) => {
                              const optionName =
                                scoreData &&
                                scoreData.eventTypes
                                  .flatMap((event) => event.options)
                                  .find((option) => option._id === data.option)
                                  ?.option;

                              return optionName ? (
                                <div key={data.option}>{optionName}</div>
                              ) : null;
                            })}
                          </div>

                          <Table size="small" aria-label="purchases">
                            <TableHead>
                              <TableRow>
                                <TableCell>Palce</TableCell>
                                <TableCell>Winner Name</TableCell>
                                <TableCell>Winner ID</TableCell>
                                <TableCell>Winner House</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {row.places.map((data, index) => (
                                <TableRow>
                                  <TableCell>{data.place}</TableCell>
                                  <TableCell>{data.member}</TableCell>
                                  <TableCell>{data.MemberID}</TableCell>
                                  <TableCell>{data.house}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default Score;
