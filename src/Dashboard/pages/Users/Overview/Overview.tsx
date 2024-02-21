import React from "react";
import { State as MainState } from "../Users";

interface overViewProps extends MainState {}

const overView: React.FC<overViewProps> = function ({ allUserData }) {
  console.log(allUserData);
  return (
    <div className="user-overview position-relative">
      <div className="content-grid-one main-content-holder">
        {allUserData &&
          allUserData.map((user, index) => (
            <div className="grid-common" key={index}>
              <h2>{user.name}</h2>
              <p>Role: {user.roles.roleType}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default overView;
