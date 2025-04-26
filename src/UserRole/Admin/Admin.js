import { useState, useEffect } from "react";

import Aside from '../../Components/Aside/Aside';
import DisplayMsgs from "./DisplayMsgs";
import Orders from "./Orders";
import Users from "./Users";
import AddProduct from "./AddProduct";
import RemoveProduct from "./RemoveProduct";
import EditProducts from "./EditProducts"
import Manage from "./Manage";

import './admin.css';

const Admin = ({ role, username }) => {
  const [currComp, setCurrComp] = useState(false);
  useEffect(() => {
    document.querySelector('html').style.overflow='hidden';
  }, []);

  return (
    <>
      <Aside passData={setCurrComp} role={role} />
      <main className="admin">
        {currComp? (
          <>
            {currComp.msg && <DisplayMsgs />}
            {currComp.orders && <Orders />}
            {currComp.admins && <Users username={ username } />}
            {currComp.addProducts && <AddProduct />}
            {currComp.removeProduct && <RemoveProduct />}
            {currComp.edit && <EditProducts />}
            {currComp.manage && <Manage />}
          </>
        ):''
        }
      </main>
    </>
  );
};

export default Admin;
