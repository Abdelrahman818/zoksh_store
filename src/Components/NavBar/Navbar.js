import { useState } from "react";
import { Link } from "react-router-dom";
import LogoutPage from "../../E-mail/Logout";

import './nav-bar.css';

const NavBar = () => {
  const [none, setNone] = useState(true);
  const [hide, setHide] = useState(true);
  const [logoutConf, setLogoutConf] = useState(false);

  const toggleMore = () => {
    none ? showMore() : hideMore();
  };
  const showMore = () => {
    setNone(false);
    setTimeout(() => setHide(false));
  };
  const hideMore = () => {
    setTimeout(() => setNone(true), 300);
    setHide(true);
  };
  const logout = () => {
    toggleMore();
    setLogoutConf(true);
  };

  return (
    <nav>
      <div className="nav-content">
        <div className="more-cont">
          <div
            className={hide ? "more" : "more cross"}
            title="more"
            onClick={toggleMore}
          >
            <span className="top"></span>
            <span className="mid"></span>
            <span className="btm"></span>
          </div>
          <ul
            className="links"
            none={none ? "" : undefined}
            hide={hide ? "" : undefined}
          >
            <Link to="/">
              <li onClick={toggleMore}>Home</li>
            </Link>
            <Link to="/products">
              <li onClick={toggleMore}>Our products</li>
            </Link>
            <Link to="/about">
              <li onClick={toggleMore}>About</li>
            </Link>
            <Link to="/location">
              <li onClick={toggleMore}>Location</li>
            </Link>
            <Link to="/contact">
              <li onClick={toggleMore}>Contact us</li>
            </Link>
            {localStorage.getItem('authToken') ?
              (
                <li className="danger" onClick={logout}>Logout</li>
              ):
              (
                <Link to="/login">
                  <li onClick={toggleMore}>Login</li>
                </Link>
              )
            }
          </ul>
        </div>
        <div className="welcome-msg">
          <span>WELCOME TO OUR STORE</span>
        </div>
        <div className="cont">
          <div className="basket">
            <i className="fa-solid fa-basket-shopping"></i>
          </div>
        </div>
      </div>
      {logoutConf&&<LogoutPage onCancel={setLogoutConf} />}
    </nav>
  );
};

export default NavBar;
