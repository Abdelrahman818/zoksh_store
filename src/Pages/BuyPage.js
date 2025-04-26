import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { OrderContext } from "../context";
import Loading from "../Components/Loading/Loading";
import api from "../config";
import "./buy-page.css";

const BuyPage = () => {
  const navigate = useNavigate();
  const { orderData } = useContext(OrderContext);
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    type: "createOrder",
    product_id: "",
    product_name: "",
    price: 0,
    quantity: 1,
    total_price: 0,
    client_name: "",
    phone: "",
    gov: "",
    area: "",
    location: "",
  });
  useEffect(() => {
    if (orderData) {
      setData((prev) => ({
        ...prev,
        product_id: orderData.id,
        product_name: orderData.name,
        price: parseFloat(orderData.price),
        total_price: parseFloat(orderData.price),
      }));
    }
  }, [orderData]);
  useEffect(() => {
    setData((prev) => ({
      ...prev,
      total_price: prev.quantity * prev.price,
    }));
  }, [data.quantity, data.price]);
  useEffect(() => {
    const allow = sessionStorage.getItem('buyAllow');
    if (!allow) navigate('/products-page');
    else sessionStorage.removeItem('buyAllow');
  }, [navigate]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: name === "quantity" ? parseInt(value) || 1 : value,
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    fetch(api, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((json) => {
        setData({
          type: "createOrder",
          product_id: "",
          product_name: "",
          price: 0,
          quantity: 1,
          total_price: 0,
          client_name: "",
          phone: "",
          gov: "",
          area: "",
          location: "",
        });
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      { loading && <Loading /> }
      <div className="buy-page">
        <div className="buy-form">
          <h2>Complete Your Order</h2>
          <span className="buying-infos">
            <i className="fa-solid fa-circle-info"></i>
            <p className="infos hidden">
              Pyment is made in cash upon delivery,
              and your order will be confirmed 
              via a phone call before shipping
            </p>
          </span>
          <span className="final-price">Total: {data.total_price} LE</span>
          <form className="buy-infos" onSubmit={handleSubmit}>
            <input
              name="client_name"
              type="text"
              required
              placeholder="Name"
              value={data.client_name}
              onChange={handleChange}
            />
            <input
              name="phone"
              type="tel"
              required
              placeholder="Phone EGY (+02)"
              value={data.phone}
              onChange={handleChange}
            />
            <input
              name="gov"
              type="text"
              required
              placeholder="Governorate"
              value={data.gov}
              onChange={handleChange}
            />
            <input
              name="area"
              type="text"
              required
              placeholder="Area"
              value={data.area}
              onChange={handleChange}
            />
            <input
              name="location"
              type="text"
              required
              placeholder="Full Address / Landmark"
              value={data.location}
              onChange={handleChange}
            />
            <input
              name="quantity"
              type="number"
              min="1"
              required
              value={data.quantity}
              onChange={handleChange}
            />
            <button type="submit" className="submit-btn">
              Order now!
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default BuyPage;
