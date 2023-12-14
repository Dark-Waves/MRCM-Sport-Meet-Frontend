export default function Overview({ allUserData }) {
  console.log(allUserData)
  return (
    <div className="user-overview position-relative">
      <div className="content-grid-one main-content-holder">
        {allUserData.map((user,index) => (
          <div
            className="grid-common"
            key={index}
          >
            <h2>{user.name}</h2>
            <p>Role: {user.roles.roleType}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
