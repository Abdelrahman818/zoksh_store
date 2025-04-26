import { useState, useEffect } from "react";
import Loading from "../../Components/Loading/Loading";
import api from "../../config";

const EditProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    type: "editUpdate",
    id: "",
    name: "",
    price: "",
    infos: "",
    category: "",
  });
  useEffect(() => {
    fetch(api, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type: "getProducts" }),
    })
      .then((res) => res.json())
      .then(setProducts);

    fetch(api, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type: "getTypes" }),
    })
      .then((res) => res.json())
      .then(setCategories)
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => {
    if (selectedProduct !== null) {
      setFormData({
        type: "editUpdate",
        id: selectedProduct.id,
        name: selectedProduct.name,
        price: selectedProduct.price,
        infos: selectedProduct.infos,
        category: selectedProduct.product_type,
      });
    }
  }, [selectedProduct]);
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const update = (e) => {
    e.preventDefault();
    setLoading(true);
    fetch(api, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .finally(() => {
        fetch(api, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ type: "getProducts" }),
        })
          .then((res) => res.json())
          .then(setProducts)
          .finally(() => {
            setLoading(false);
            setSelectedProduct(null);
          });
      });
  };

  const handelChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  function capitalizeFirst(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  return (
    <>
      {loading && <Loading />}

      {selectedProduct && (
        <div className="parent bg-dark">
          <div className="edit-box">
            <div className="cross" onClick={() => setSelectedProduct(null)}>
              <span className="r"></span>
              <span className="l"></span>
            </div>
            <form className="edit">
              <input
                name="name"
                placeholder="Edit name"
                type="text"
                value={formData.name}
                onChange={handelChange}
              />
              <input
                name="infos"
                placeholder="Edit infos"
                type="text"
                value={formData.infos}
                onChange={handelChange}
              />
              <input
                name="price"
                placeholder="Edit price"
                type="number"
                value={formData.price}
                onChange={handelChange}
              />
              <select
                name="category"
                value={formData.category}
                onChange={handelChange}
                style={{
                  backgroundColor: "#2b2b2b",
                  color: "#eee",
                  border: "none",
                }}
              >
                {categories.length > 0 &&
                  categories.map((e) => (
                    <option key={e.id} value={e.name.toLowerCase()}>
                      {capitalizeFirst(e.name)}
                    </option>
                  ))}
              </select>
              <button className="update-btn" onClick={update}>
                Update
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="edit-cont">
        <input
          id="edit-search"
          type="text"
          placeholder="Search products by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="products-edit">
          {filteredProducts.map((e, index) => (
            <div
              className="product"
              key={index}
              onClick={() => setSelectedProduct(e)}
            >
              <div className="product-img">
                <img
                  src={`http://localhost/zoksh-store/src/PHP/${e.temp}`}
                  alt=""
                />
              </div>
              <div className="name">
                <span>{e.name}</span>
              </div>
              <div className="price">
                <span>{e.price}</span>
              </div>
              <div className="infos">
                <span>{e.infos}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default EditProducts;
