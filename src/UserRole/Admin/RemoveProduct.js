import { useEffect, useState } from "react";
import Loading from "../../Components/Loading/Loading";
import api from "../../config";

const RemoveProduct = () => {
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    fetch(api, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type: "getProducts" }),
    })
      .then((res) => res.json())
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);
  const toggleProduct = (product) => {
    setSelected((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      } else {
        return [...prev, { id: product.id, temp: product.temp, imgs: product.imgs }];
      }
    });
    console.log(selected);
  };
  const remove = () => {
    if (selected.length > 0) {
      setLoading(true);
      fetch(api, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "remvoeProduct",
          data: selected,
        }),
      })
        .then((res) => res.json())
        .finally(() => {
          setLoading(false);
          window.location.reload();
        });
    }
  };

  return (
    <>
      {loading && <Loading />}
      <button
        className={`del-btn ${!selected.length > 0 ? "disabled" : ""}`}
        onClick={remove}
      >
        Delete
      </button>
      <div className="remove-product-cont">
        <h3>Remove products</h3>
        <div className="search-bar">
          <input type="text" name="search" placeholder="Search for a product by name" />
        </div>
        <div className="products-area">
          {products !== null &&
            products.map((e) => (
              <div
                className={`product-remove ${selected.some((p) => p.id === e.id) ? "selected" : ""}`}
                key={e.id}
                onClick={() => toggleProduct(e)}
              >
                <div
                  className="checkbox-square"
                  onClick={(ev) => {
                    ev.stopPropagation();
                    toggleProduct(e);
                  }}
                >
                  {selected.some((p) => p.id === e.id) && <span className="checkmark">✔</span>}
                </div>
                <div className="product-img-remove">
                  <img
                    src={e.temp}
                    alt="corrupted img"
                  />
                </div>
                <div className="product-disc-remove">
                  <p>{e.infos}</p>
                </div>
                <div className="product-price-remove">
                  <span>{e.price}</span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default RemoveProduct;
