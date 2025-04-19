import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Client from "./UserRole/Client/Client";
import Admin from "./UserRole/Admin/Admin";
import Loading from "./Components/Loading/Loading";

function App() {
  const navigate = useNavigate();
  const [role, setRole] = useState('');
  const [expired, setExpired] = useState(false);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    window.location.reload();
    navigate('/');
  };
  const check = () => {
    setLoading(true);
    const token = localStorage.getItem("authToken");
    let ursRole;

    if (token) {
      fetch("http://localhost/zoksh-store/src/PHP/back.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "checkToken",
          token: token,
        }),
      }).then((res) => res.json())
        .then((json) => {
          console.log(json);
          if (json.msg === 'invalidToken') {
            if (json.error === 'Expired token') {
              setExpired(true);
            } else {
              localStorage.removeItem('authToken');
            }
          }
          setRole(json.role);
          setUserName(json.username);
        })
        .catch((err) => {
          console.error("Token check failed", err);
          setRole('usr');
        })
        .finally(setLoading(false));
    } else {
      setRole('usr');
      setLoading(false);
    }
    return ursRole;
  };
  useEffect(() => {
    const usrRole = check();
    setRole(usrRole);
    setUserName()
  }, []);

  return (
    <>
      { loading && <Loading /> }
      {role === "adm" ||
        role === "onr" ? (
          <Admin role={ role } username={ userName } />
        ) : (
          <Client />
        )
      } {expired &&
        <div className="logout-container bg-dark parent">
          <div className="logout-card">
            <h2>Your session is expired, please login again.</h2>
            <div className="btns">
              <button className="logout-button" onClick={handleLogout}>OK</button>
            </div>
          </div>
        </div>
      }
    </>
  );
}

export default App;
