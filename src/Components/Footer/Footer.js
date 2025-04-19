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
            <a href="https://www.facebook.com/share/1AX3787Bh2/?mibextid=wwXIfr" target="blank"
              ><i className="fa-brands fa-facebook"></i
            ></a>
          </li>
          <li>
            <a href="https://www.instagram.com/zoksh.eg?igsh=MXg1ejExNDJyYmRieA==" target="blank"
              ><i className="fa-brands fa-instagram"></i
            ></a>
          </li>
          <li>
            <a href="https://www.tiktok.com/@zoksh.store?_t=ZS-8vVNGzZQkGz&_r=1" target="blank"
              ><i className="fa-brands fa-tiktok"></i
            ></a>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
