import React, { useEffect, useReducer, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Overview from "./Overview/Overview";
import AddMembers from "./AddMembers/AddMembers";
import EditMembers from "./EditMembers/EditMembers";
import { config } from "../../utils/config";
import axios from "axios";
import Cookies from "js-cookie";
import Loader from "../../../Components/Loader/Loader";
import { Error } from "parse";
import ErrorPage from "../../../Components/Error/Error";

export interface MemberData {
  // Define your member data structure here
  // Example: name: string;
  HouseID: number | null;
  Grade: string;
  House: string;
  Name: string;
  _id: string;
}

export interface State {
  status: "loading" | "error" | "ready";
  allMembersData: MemberData[] | null;
  allMembersDataStatus: "loading" | "error" | "ready";
}
export type Action =
  | { type: "setStatus"; payload: "loading" | "error" | "ready" }
  | { type: "setAllMembersData"; payload: any[] }
  | { type: "setAllMembersDataStatus"; payload: "loading" | "error" | "ready" };

const initialValue: State = {
  status: "loading",
  allMembersData: null,
  allMembersDataStatus: "loading",
};

const reducer = function (state: State, action: Action): State {
  switch (action.type) {
    case "setStatus":
      return { ...state, status: action.payload };
    case "setAllMembersData":
      return { ...state, allMembersData: action.payload };
    case "setAllMembersDataStatus":
      return { ...state, allMembersDataStatus: action.payload };
    default:
      throw new Error("Method not found");
  }
};
const Members: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialValue);
  const { status, allMembersData, allMembersDataStatus } = state;

  useEffect(() => {
    if (allMembersDataStatus === "loading" || !allMembersData) {
      return;
    }
    dispatch({ type: "setStatus", payload: "ready" });
  }, [allMembersData, allMembersDataStatus]);

  useEffect(() => {
    const getData = async () => {
      if (allMembersDataStatus !== "loading") return;
      try {
        const token = Cookies.get("token");
        const { data } = await axios.get<{ membersData: MemberData[] }>(
          `${config.APIURI}/api/v1/members`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!data || !data.membersData) throw new Error("cannot get the data");

        dispatch({ type: "setAllMembersData", payload: data.membersData });
        dispatch({
          type: "setAllMembersDataStatus",
          payload: "ready",
        });
      } catch (error) {
        dispatch({
          type: "setAllMembersDataStatus",
          payload: "error",
        });
      }
    };
    getData();
  }, []);

  console.log(allMembersData);

  return (
    <div className="Members main-content-holder">
      {status === "loading" ? (
        <Loader />
      ) : status === "error" ? (
        <ErrorPage code={400} />
      ) : (
        <Routes>
          <Route index path="/" element={<Overview {...state} />} />
          <Route
            path="Edit"
            element={<EditMembers {...state} dispatch={dispatch} />}
          />
          <Route
            path="Add"
            element={<AddMembers {...state} dispatch={dispatch} />}
          />
        </Routes>
      )}
    </div>
  );
};

export default Members;
