import { useEffect, useState } from "react";
import Loading from "../../Components/Loading/Loading";
import api from "../../config";

const Users = ({ username }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(api, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "getAllUsers" }),
    })
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Failed to fetch users", err))
      .finally(() => setLoading(false));
  }, []);
  const handleRoleChange = (index, newRole) => {
    setLoading(true);
    const updatedUsers = [...users];
    updatedUsers[index].role = newRole;
    setUsers(updatedUsers);

    fetch(api, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "updateRole",
        id: users[index].id,
        newRole,
      }),
    }).then(() => setLoading(false));
  };
  const dict = {
    usr: "User",
    adm: "Admin",
    onr: "Owner",
  };
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {loading && <Loading />}
      <div className="users-container">
        <h2>All Users</h2>
        {/* Search bar */}
        <input
          type="text"
          placeholder="Search by name or email"
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="users-list">
          {filteredUsers.map((user, index) =>
            user.name !== username ? (
              <div className="user-card" key={index}>
                <p>
                  <span className="label">Name:</span> {user.name}
                </p>
                <p>
                  <span className="label">Phone:</span> {user.phone}
                </p>
                <p>
                  <span className="label">Email:</span> {user.email}
                </p>
                <p>
                  <span className="label">Role:</span> {dict[user.role]}
                </p>
                <div className="role-select">
                  <label>Role:</label>
                  <select
                    onChange={(e) =>
                      handleRoleChange(index, e.target.value)
                    }
                  >
                    <option value="usr">User</option>
                    <option value="adm">Admin</option>
                    <option value="onr">Owner</option>
                  </select>
                </div>
              </div>
            ) : null
          )}
        </div>
      </div>
    </>
  );
};

export default Users;
