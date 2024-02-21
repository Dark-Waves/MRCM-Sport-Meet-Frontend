import React from "react";
import { Action, State as MainState } from "../Users";

interface overViewProps extends MainState {
  dispatch: React.Dispatch<Action>; // Update with the appropriate type for your dispatch function
}
const Edit: React.FC<overViewProps> = function ({ dispatch, currentUser }) {
  return <div>Edit</div>;
};
export default Edit;
