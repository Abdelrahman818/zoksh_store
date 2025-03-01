import './footer.css';

const Footer = () => {
  return (
    <footer>
      <div className="copy-right">
        <span>
          This site is made by me <strong>Bodi</strong>&copy;
        </span>
      </div>
      <div className="my-links">
        <ul>
          <li>
            <a href="https://www.facebook.com/" target="blank">
              <i className="fa-brands fa-facebook"></i>
            </a>
          </li>
          <li>
            <a href="https://twitter.com/" target="blank">
              <i className="fa-brands fa-twitter"></i>
            </a>
          </li>
          <li>
            <a href="https://www.instagram.com/" target="blank">
              <i className="fa-brands fa-instagram"></i>
            </a>
          </li>
          <li>
            <a href="https://www.tiktok.com/" target="blank">
              <i className="fa-brands fa-tiktok"></i>
            </a>
          </li>
          <li>
            <a href="https://www.discord.com/" target="blank">
              <i className="fa-brands fa-discord"></i>
            </a>
          </li>
          <li>
            <a href="https://www.github.com/" target="blank">
              <i className="fa-brands fa-github"></i>
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
