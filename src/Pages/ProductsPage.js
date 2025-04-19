import { useState } from "react";

import DisplayProducts from "../HomePage/Products/ProductsDisplay";

import './products-page.css';

const ProductsPage = (props) => {

  const products = ["Shirts", "Hoodies", "Jackets", "Pullovers", "Sweatshirts"];
  const [currFilter, setCurrFilter] = useState(props.filter);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);
  const [isCollapsed, setIsCollapsed] = useState(true);
  
  const changeFilter = (e) => {
    setCurrFilter(e);
    toggleCollapse();
  }

  return (
    <>
      <div className="products-control">
        <div className="filter">
          <div className="selected-filter" onClick={toggleCollapse}>{ currFilter }</div>
          <ul className={isCollapsed?"collapsed":undefined}>
            <li onClick={(e) => changeFilter('Choose filter')}>All</li>
            {products.map((e, index) => (
              <li key={index} onClick={() => changeFilter(e)}>
                { e }
              </li>
            ))}
          </ul>
        </div>
      </div>
      <section className="products page">
        <DisplayProducts filter={ currFilter } />
      </section>
    </>
  );
};

export default ProductsPage;
