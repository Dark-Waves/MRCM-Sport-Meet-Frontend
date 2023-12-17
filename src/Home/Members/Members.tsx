import React, { FC, useContext } from "react";
import { State } from "../Home";
import HomeContext from "../../context/HomeContext";

export const Members: FC = () => {
  const { memberData }: State = useContext(HomeContext);
console.log(memberData)
  return <div>Members</div>;
};
