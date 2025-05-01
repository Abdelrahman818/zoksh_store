import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import LogoutPage from "../../E-mail/Logout";
import './nav-bar.css';

const NavBar = () => {
  const [none, setNone] = useState(true);
  const [hide, setHide] = useState(true);
  const [logoutConf, setLogoutConf] = useState(false);
  const moreContRef = useRef();
  
  const showMore = () => {
    setNone(false);
    setTimeout(() => setHide(false), 10);
  };
  const hideMore = () => {
    setHide(true);
    setTimeout(() => setNone(true), 300);
  };
  const toggleMore = () => {
    none ? showMore() : hideMore();
  };
  const logout = () => {
    toggleMore();
    setLogoutConf(true);
  };
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        moreContRef.current &&
        !moreContRef.current.contains(e.target)
      ) {
        if (!none) hideMore();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [none]);

  return (
    <nav>
      <div className="nav-content">
        <div className="more-cont" ref={moreContRef}>
          <div
            className={hide ? "more" : "more cross"}
            title="more"
            onClick={toggleMore}
          >
            <span className="top"></span>
            <span className="mid"></span>
            <span className="btm"></span>
          </div>

          <ul className={`links ${none ? "none" : ""} ${hide ? "hide" : ""}`}>
            <Link to="/"><li onClick={toggleMore}>Home</li></Link>
            <Link to="/products-page"><li onClick={toggleMore}>Our products</li></Link>
            <Link to="/about"><li onClick={toggleMore}>About</li></Link>
            <Link to="/location"><li onClick={toggleMore}>Location</li></Link>
            <Link to="/contact"><li onClick={toggleMore}>Contact us</li></Link>
            {localStorage.getItem('authToken') ? (
              <li className="danger" onClick={logout}>Logout</li>
            ) : (
              <Link to="/login"><li onClick={toggleMore}>Login</li></Link>
            )}
          </ul>
        </div>

        <div className="welcome-msg">
          <span>WELCOME TO OUR STORE</span>
        </div>
      </div>

      {logoutConf && <LogoutPage onCancel={setLogoutConf} />}
    </nav>
  );
};

export default NavBar;
