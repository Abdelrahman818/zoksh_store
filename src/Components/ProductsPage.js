import { useState } from "react";

import DisplayProducts from "../HomePage/Products/ProductsDisplay";

import '../HomePage/Products/products.css';

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
      <div className="filter">
        <div className="selected-filter" onClick={toggleCollapse}>{ currFilter }</div>
        <ul className={isCollapsed?"collapsed":undefined}>
          {products.map((e, index) => (
            <li key={index} onClick={() => changeFilter(e)}>
              { e }
            </li>
          ))}
        </ul>
      </div>
      <div className="displaying">
        <span className="new">New</span>
        <span className="featured">Featured</span>
        <span className="all" onClick={() => setCurrFilter('Choose filter')}>All</span>
      </div>
      <section className="products page">
        <DisplayProducts filter={ currFilter } />
      </section>
    </>
  );
};

export default ProductsPage;
