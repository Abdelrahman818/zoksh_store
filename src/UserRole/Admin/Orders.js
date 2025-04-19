import { useEffect, useState } from "react";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("http://localhost/zoksh-store/src/PHP/back.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type: "getOrders" }),
    })
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.error("Error fetching orders:", err));
  }, []);

  const handleStatusChange = (id, newStatus) => {
    fetch("http://localhost/zoksh-store/src/PHP/back.php", {
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
        console.log(res);
        if (res.success) {
          setOrders((prev) =>
            prev.map((order) =>
              order.id === id ? { ...order, orderStat: newStatus } : order
            )
          );
        }
      });
  };

  return (
    <div className="orders-wrapper">
      <h2 className="orders-title">All Orders</h2>
      <div className="orders-grid">
        {orders.map((order) => (
          <div className="order-card" key={order.order_id}>
            <div className="order-header">
              <span className="order-name">{order.productName}</span>
              <span className="order-price">{order.price}</span>
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
                onChange={(e) => handleStatusChange(order.order_id, e.target.value)}
              >
                <option value="" defaultValue="" none="">Change status</option>
                <option value="pending">Pending</option>
                <option value="in deliver">In Deliver</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
