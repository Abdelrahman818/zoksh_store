import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../config';
import Loading from '../../Components/Loading/Loading';

const AvailbleProducts = ({ getFilter }) => {
  const [flipped, setFlipped] = useState({});
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(api, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type: 'getTypes' }),
    })
      .then(res => res.json())
      .then(json => {
        setData(json);
      })
      .finally(() => setLoading(false));
  }, []);
  const flipIt = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <>
      {loading && <Loading />}
      {Array.isArray(data) && data.length > 0 &&
        data.map((e) => (
          <div className="card-cont" key={e.id} onClick={() => getFilter(e.name.toLowerCase())}>
            <div
              className={flipped[e.id] ? "card flip" : "card"}
              onClick={() => flipIt(e.id)}
            >
              <div className="front">
                <h3 className="product-title">{e.name}</h3>
                <img src={`http://localhost/zoksh-store/src/PHP/${e.temp}`} alt="" />
              </div>
              <div className="back">
                <p>Crafted for comfort. Designed for distinction.</p>
                <Link to="/products-page" style={{ textDecoration: 'none', color: '#000' }}>
                  <span className="view" onClick={() => getFilter(e.name)}>
                    View
                  </span>
                </Link>
              </div>
            </div>
          </div>
        ))}
    </>
  );
};

export default AvailbleProducts;
