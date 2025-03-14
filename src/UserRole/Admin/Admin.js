import { useState } from "react";
import Aside from '../../Components/Aside/Aside';
import DisplayMsgs from "./DisplayMsgs";

import './admin.css';

const Admin = () => {
  const [showComp, setShowComp] = useState('');
  const [editSMdeia, setEditSMedia] = useState('');
  
  return (
    <>
      <Aside activate={setShowComp} sMediaEdit={setEditSMedia} />
      <main>
        <DisplayMsgs />
      </main>
    </>
  );
};

export default Admin;
