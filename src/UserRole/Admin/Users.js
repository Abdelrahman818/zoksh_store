import { useEffect, useState } from "react";
import Loading from "../../Components/Loading/Loading";

const Users = ({ username }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("http://localhost/zoksh-store/src/PHP/back.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "getAllUsers" }),
    })
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Failed to fetch users", err));
  }, []);
  const handleRoleChange = (index, newRole) => {
    setLoading(true);
    const updatedUsers = [...users];
    updatedUsers[index].role = newRole;
    setUsers(updatedUsers);
    console.log(updatedUsers[index].id)

    fetch("http://localhost/zoksh-store/src/PHP/back.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "updateRole",
        id: users[index].id,
        newRole,
      }),
    })
      .then(() => setLoading(false));
  };
  const dict = {
    'usr': 'User',
    'adm': 'Admin',
    'onr': 'Owner'
  };

  return (
    <>
      {loading && <Loading />}
      <div className="users-container">
        <h2>All Users</h2>
        <div className="users-list">
          {users.map((user, index) => (
            user.name !== username ? (
              <div className="user-card" key={index}>
                <p><span className="label">Name:</span> {user.name}</p>
                <p><span className="label">Phone:</span> {user.phone}</p>
                <p><span className="label">Email:</span> {user.email}</p>
                <div className="role-select">
                  <label>Role:</label>
                  <select
                    onChange={(e) => handleRoleChange(index, e.target.value)}
                  >
                    <option value="" defaultValue="" none="">{dict[user.role]}</option>
                    <option value="usr">User</option>
                    <option value="adm">Admin</option>
                    <option value="onr">Owner</option>
                  </select>
                </div>
              </div>
            ):''
          ))}
        </div>
      </div>
    </>
  );
};

export default Users;
