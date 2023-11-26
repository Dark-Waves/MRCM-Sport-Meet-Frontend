import AddUsers from "./AddUsers/AddUsers";
import UserEdit from "./UserEdit/UserEdit";
import { Route, Routes } from "react-router-dom";
import Overview from "./Overview/Overview";

export default function Users() {
  return (
    <div className="Users main-content-holder">
      <Routes>
        <Route index path="/" element={<Overview />} />
        <Route path="Edit" element={<UserEdit />} />
        <Route path="Add" element={<AddUsers />} />
      </Routes>
    </div>
  );
}
