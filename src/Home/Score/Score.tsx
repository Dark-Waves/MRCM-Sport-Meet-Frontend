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
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { State } from "../Home";
import HomeContext from "../../context/HomeContext";

interface SelectedEventTypes {
  option_id: string;
  eventType_id: string;
}

interface ScoreData {
  eventTypes: {
    _id: string;
    name: string;
    options: {
      _id: string;
      option: string;
    }[];
  }[];
}

interface ScoreBoard {
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
}

const Score: FC = () => {
  const { scoreData, houseData }: State = useContext(HomeContext);
  const [selectedEventTypes, setSelectedEventTypes] = useState<
    SelectedEventTypes[]
  >([]);
  console.log("selectedEventTypes: ", selectedEventTypes);
  const [filteredScores, setFilteredScores] = useState<ScoreBoard[]>(
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
    const updatedEventTypes = [...selectedEventTypes];
    setSelectedEventTypes(updatedEventTypes);
  };

  const handleTypeChange = (
    e: SelectChangeEvent<string>,
    eventType_id: string
  ) => {
    e.preventDefault();

    const option_id = e.target.value;

    // Check if option_id is provided
    if (option_id) {
      // Check if eventType_id already exists in selectedEventTypes
      const index = selectedEventTypes.findIndex(
        (type) => type.eventType_id === eventType_id
      );

      // If eventType_id exists, update the option_id
      if (index !== -1) {
        const updatedSelectedEventTypes = [...selectedEventTypes];
        updatedSelectedEventTypes[index] = {
          ...updatedSelectedEventTypes[index],
          option_id,
        };
        setSelectedEventTypes(updatedSelectedEventTypes);
      } else {
        // If eventType_id doesn't exist, add a new entry to selectedEventTypes
        setSelectedEventTypes([
          ...selectedEventTypes,
          { option_id, eventType_id },
        ]);
      }
    } else {
      // If no option_id is provided, remove the entry with matching eventType_id
      const filteredEventTypes = selectedEventTypes.filter(
        (type) => type.eventType_id !== eventType_id
      );
      setSelectedEventTypes(filteredEventTypes);
    }
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
    // console.log(selectedEventTypes, scoreData);
    if (!selectedEventTypes.length) {
      console.log(scoreData?.scoreBoard);
      setFilteredScores(scoreData?.scoreBoard || []);
    } else {
      const selectedOptions = selectedEventTypes.flatMap(
        (selected) => selected.option_id
      );
      console.log(selectedOptions);
      const filteredEvents = scoreData?.scoreBoard.filter((event) => {
        return selectedOptions.every((item) =>
          event.eventType.find(({ option }) => option === item)
        );
      });

      setFilteredScores(filteredEvents || []);
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
      <div className="flex-row g-5 m-5 bg-second p-3 rounded">
        {scoreData &&
          scoreData.eventTypes?.map((data, index) => (
            <div className="option_selection w-40" key={index}>
              <FormControl key={data._id} fullWidth>
                <InputLabel id={`event-type-label-${data._id}`}>
                  {data.name}
                </InputLabel>
                <Select
                  label={data.name}
                  labelId={`event-type-label-${data._id}`}
                  id={`event-type-${data._id}`}
                  value={
                    selectedEventTypes.find(
                      (selected) => selected.eventType_id === data._id
                    )?.option_id || ""
                  }
                  onChange={(e) => handleTypeChange(e, data._id)}
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
      </div>

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
                      const matchingPlaces = row.places.filter(
                        (place) => place.house === data.Name
                      );

                      return (
                        <TableCell key={dataIndex}>
                          {matchingPlaces.length > 0
                            ? matchingPlaces.map((matchingPlace, index) => (
                                <div key={index}>
                                  {`${getOrdinal(matchingPlace.place)} - ${
                                    matchingPlace.member
                                  }${
                                    row.inputType === "MemberID"
                                      ? `(${matchingPlace.MemberID})`
                                      : ""
                                  }`}
                                </div>
                              ))
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
