import { useState, useEffect } from "react";

const Aside = ({ passData, role }) => {
  const [collapsed, setCollapsed] = useState(true);
  const [showMsgs, setShowMsgs] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [showUsers, setShowUsers] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [addProducts, setAddProducts] = useState(false);
  const [removeProduct, setRevomeProduct] = useState(false);
  const [edit, setEdit] = useState(false);
  const [manage, setManage] = useState(false);

  const toggleSidebar = () => {
    setShowSidebar((prev) => !prev);
  };
  const enableSwitches = (select) => {
    if (select === "msg") {
      setShowMsgs(true);
      setShowOrders(false);
      setShowUsers(false);
      setAddProducts(false);
      setRevomeProduct(false);
      setEdit(false);
      setManage(false);
    } else if (select === "orders") {
      setShowMsgs(false);
      setShowOrders(true);
      setShowUsers(false);
      setAddProducts(false);
      setRevomeProduct(false);
      setEdit(false);
      setManage(false);
    } else if (select === "admins") {
      setShowMsgs(false);
      setShowOrders(false);
      setShowUsers(true);
      setAddProducts(false);
      setRevomeProduct(false);
      setEdit(false);
      setManage(false);
    } else if (select === "addProduct") {
      setShowMsgs(false);
      setShowOrders(false);
      setShowUsers(false);
      setAddProducts(true);
      setRevomeProduct(false);
      setEdit(false);
      setManage(false);
    } else if (select === "removeProduct") {
      setShowMsgs(false);
      setShowOrders(false);
      setShowUsers(false);
      setAddProducts(false);
      setRevomeProduct(true);
      setEdit(false);
      setManage(false);
    } else if (select === "edit") {
      setShowMsgs(false);
      setShowOrders(false);
      setShowUsers(false);
      setAddProducts(false);
      setRevomeProduct(false);
      setEdit(true);
      setManage(false);
    } else if (select === "manage") {
      setShowMsgs(false);
      setShowOrders(false);
      setShowUsers(false);
      setAddProducts(false);
      setRevomeProduct(false);
      setEdit(false);
      setManage(true);
    }
  };
  const logout = () => {
    localStorage.removeItem("authToken");
    window.location.reload();
  };
  useEffect(() => {
    passData({
      msg: showMsgs,
      orders: showOrders,
      admins: showUsers,
      addProducts,
      removeProduct,
      edit,
      manage,
    });
  }, [
    showMsgs,
    showOrders,
    showUsers,
    addProducts,
    removeProduct,
    edit,
    manage,
  ]);
  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <>
      <div className={showSidebar ? "parent bg-dark div" : "div"}></div>
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        ☰ Menu
      </button>
      <aside className={`aside ${showSidebar ? "visible" : ""}`}>
        <div className="headers">
          <h3 onClick={() => enableSwitches("msg")}>Messages</h3>
          <h3 onClick={() => enableSwitches("orders")}>Orders</h3>
          <h3 onClick={toggleCollapse}>Edit products</h3>
          <ul
            className={collapsed ? "edit-products collapsed" : "edit-products"}
          >
            <li onClick={() => enableSwitches("addProduct")}>Add</li>
            <li onClick={() => enableSwitches("removeProduct")}>Remove</li>
            <li onClick={() => enableSwitches("edit")}>Modify</li>
          </ul>
          <h3 onClick={() => enableSwitches("manage")}>Manage products</h3>
          {role === "onr" ? (
            <h3
              style={{ color: "orange" }}
              onClick={() => enableSwitches("admins")}
            >
              Show all users
            </h3>
          ) : (
            ""
          )}
          <h3 className="danger" onClick={logout}>
            Logout
          </h3>
        </div>
      </aside>
    </>
  );
};

export default Aside;
