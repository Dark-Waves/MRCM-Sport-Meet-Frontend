import AddMembers from "./AddMembers/AddMembers";
import EditMembers from "./EditMembers/EditMembers";
import { Route, Routes } from "react-router-dom";
import Overview from "./Overview/Overview";

export default function Members() {
  return (
    <div className="Members main-content-holder">
      <Routes>
        <Route index path="/" element={<Overview />} />
        <Route path="Edit" element={<EditMembers />} />
        <Route path="Add" element={<AddMembers />} />
      </Routes>
    </div>
  );
}
