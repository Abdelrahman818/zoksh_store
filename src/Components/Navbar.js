import { useState } from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
  const [none, setNone] = useState(true);
  const [hide, setHide] = useState(true);

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

  return (
    <nav>
      <div className="welcome-msg">
        <span>WELCOME TO OUR STORE</span>
      </div>
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
            <Link to="/login">
              <li onClick={toggleMore}>Login</li>
            </Link>
          </ul>
        </div>
        <div className="logo">LOGO</div>
        <div className="cont">
          <div className="search">
            <i className="fa-solid fa-magnifying-glass"></i>
          </div>
          <div className="basket">
            <i className="fa-solid fa-basket-shopping"></i>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
