import { useState } from 'react';
import './aside.css'

const Aside = ({ activate, sMediaEdit }) => {
  const [collapsed, setCollapsed] = useState(true);
  const toggleCollapse = (e) => {
    setCollapsed(!collapsed)
    activate(e)
  }
  const toggleShowSMedia = () => {
    sMediaEdit(true);
  }
  return (
    <aside>
      <div className='headers'>
        <h3 onClick={(e) => activate(e.target.innerText)}>Messages</h3>
        <h3 onClick={(e) => activate(e.target.innerText)}>Orders</h3>
        <h3 onClick={(e) => toggleCollapse(e.target.innerText)}>Edit products</h3>
        <ul className={collapsed?'edit-products collapsed':'edit-products'}>
          <li>Add</li>
          <li>Remove</li>
          <li>Modify</li>
        </ul>
        <h3 onClick={toggleShowSMedia}>Social media</h3>
      </div>
    </aside>
  );
}

export default Aside;
