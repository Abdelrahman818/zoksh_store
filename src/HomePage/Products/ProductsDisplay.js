import { useState, useEffect } from "react";
import ProductShowCase from "./ProductShowCase";
import Loading from "../../Components/Loading/Loading";
import api from "../../config";

const DisplayProducts = ({ filter }) => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  const showProduct = (product) => {
    setSelectedProduct(product);
    setTimeout(() => setModalVisible(true), 10);
  };
  const hideProductCase = () => {
    setModalVisible(false);
    setTimeout(() => setSelectedProduct(null), 300);
  };
  useEffect(() => {
    setLoading(true);
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

  return (
    <>
      { loading && <Loading /> }
      {selectedProduct && (
        <div className={`modal-wrapper ${modalVisible ? 'fade-in' : 'fade-out'}`}>
          <ProductShowCase
            onClose={hideProductCase}
            data={selectedProduct}
          />
        </div>
      )}
      {products
        .filter((e) => {
          if (!filter || filter === "") return true;
          return e.product_type.toLowerCase() === filter.toLowerCase();
        }).map((e) => {
        return (
          <div
            className="product"
            key={e.id}
            onClick={() => showProduct(e)}
          >
            <div className="product-img">
              <img
                src={e.temp}
                alt="No img"
              />
            </div>
            <div className="product-disc">
              <span>{e.name}</span>
            </div>
            <div className="product-price">
              <span>{e.price} LE</span>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default DisplayProducts;
