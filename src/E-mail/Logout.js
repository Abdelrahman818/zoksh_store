import { useNavigate } from "react-router-dom";

const LogoutPage = ({ onCancel }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("logged_in");
    window.location.reload();
    navigate("/");
    onCancel(false);
  };

  return (
    <div className="logout-container bg-dark parent">
      <div className="logout-card">
        <h2>Are you sure you want to log out?</h2>
        <div className="btns">
          <button className="logout-button" onClick={handleLogout}>Logout</button>
          <button className="cancel-button" onClick={() => onCancel(false)}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default LogoutPage;
