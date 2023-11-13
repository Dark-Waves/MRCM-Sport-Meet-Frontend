import BanUsers from "./BanUsers/BanUsers";
import UserRole from "./UserRole/UserRole";
import { Route, Routes } from "react-router-dom";
import Overview from "./Overview/Overview";

export default function Users() {
  return (
    <div className="Users main-content-holder">
      {/* <UserRole />
      <BanUsers /> */}
      <Routes>
        <Route index path="/" element={<Overview />} />
        <Route path="Role" element={<UserRole />} />
        <Route path="Ban" element={<BanUsers />} />
      </Routes>
    </div>
  );
}
