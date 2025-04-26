import { useEffect, useState } from "react";
import api from "../../config";
import Loading from "../../Components/Loading/Loading";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(api, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type: "getOrders" }),
    })
      .then((res) => res.json())
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);
  const handleStatusChange = (id, newStatus) => {
    fetch(api, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "updateStatus",
        id: id,
        status: newStatus,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setOrders((prev) =>
            prev.map((order) =>
              order.order_id === id ? { ...order, order_status: newStatus } : order
            )
          );
        }
      });
  };
  const filteredOrders =
    filter === "all" ?
    orders : orders.filter((order) =>
      order.order_status===filter
    );

  return (
    <>
      { loading && <Loading /> }
      <div className="orders-wrapper">
        <h2 className="orders-title">All Orders</h2>

        <div className="filter-bar">
          <label htmlFor="statusFilter">Filter by status:</label>
          <select
            id="statusFilter"
            className="status-filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="in deliver">In Deliver</option>
            <option value="done">Done</option>
          </select>
        </div>

        <div className="orders-grid">
          {filteredOrders.map((order) => (
            <div className="order-card" key={order.order_id}>
              <div className="order-header">
                <span className="order-name">{order.productName}</span>
                <span className="order-price">
                  <span className="price">
                    {order.price} × {order.quantity} = {order.price*order.quantity}
                  </span>
                </span>
              </div>
              <div className="order-details">
                <p><strong>Client:</strong> {order.client_name}</p>
                <p><strong>Phone:</strong> {order.client_phone}</p>
                <p><strong>Governorate:</strong> {order.gov}</p>
                <p><strong>Location:</strong> {order.location}</p>
                <p><strong>Area:</strong> {order.area}</p>
                <p><strong>Quantity:</strong> {order.quantity}</p>
                <p><strong>Status:</strong> {order.order_status}</p>
                <select
                  className="status-dropdown"
                  onChange={(e) =>
                    handleStatusChange(order.order_id, e.target.value)
                  }
                >
                  <option value="" disabled defaultValue="">Change status</option>
                  <option value="pending">Pending</option>
                  <option value="in deliver">In Deliver</option>
                  <option value="done">Done</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Orders;