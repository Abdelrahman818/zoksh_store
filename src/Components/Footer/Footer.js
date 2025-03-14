import './footer.css';
import { useState, useEffect } from 'react';

const Footer = () => {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch('http://localhost/zoksh-store/src/PHP/back.php', {
      method: 'POST',
      body: JSON.stringify({
        type: 'getLinks'
      })
    }).then(res => res.json())
      .then(json => {setData(json);console.log(json )});
  }, [])
  return (
    <footer>
      <div className="copy-right">
        <span>
          This site is made by me <strong>Bodi</strong>&copy;
        </span>
      </div>
      <div className="my-links">
        <ul>
          {data &&
            data.map((e, i) => {
              return(
                <li key={i}>
                  <a href={e.link} target='blank'>
                    <i className={e.element}></i>
                  </a>
                </li>
              )
            })
          }
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
