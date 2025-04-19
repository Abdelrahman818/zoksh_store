import { useState } from "react";

import Aside from '../../Components/Aside/Aside';
import DisplayMsgs from "./DisplayMsgs";
import Orders from "./Orders";
import Users from "./Users";
import AddProduct from "./AddProduct";

import './admin.css';

const Admin = ({ role, username }) => {
  const [currComp, setCurrComp] = useState(false);
  
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
          </>
        ):''
        }
      </main>
    </>
  );
};

export default Admin;
