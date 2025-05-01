import { useEffect, useState } from "react";

import DisplayProducts from "../HomePage/Products/ProductsDisplay";
import Loading from "../Components/Loading/Loading";
import api from "../config";

import "./products-page.css";

const ProductsPage = ({ filter }) => {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [currFilter, setCurrFilter] = useState(filter);
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);
  const capitalizeFirst = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };
  const changeFilter = (e) => {
    setCurrFilter(e);
    toggleCollapse();
  };
  useEffect(() => {
    fetch(api, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type: "getTypes" }),
    })
      .then((res) => res.json())
      .then(setCategories)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      {loading && <Loading />}
      <div className="products-control">
        <div className="filter">
          <select
            value={currFilter}
            onChange={(e) => changeFilter(e.target.value)}
            className="filter-select"
            style={{
              padding: "5px 20px",
              border: "none",
              outline: "none",
              cursor: "pointer",
              position: "relative",
              top: "80px",
            }}
          >
            <option value="">All</option>
            {categories.map((e) => (
              <option key={e.id} value={e.name.toLowerCase()}>
                {capitalizeFirst(e.name)}
              </option>
            ))}
          </select>
        </div>
      </div>
      <section className="products page">
        <DisplayProducts filter={currFilter} />
      </section>
    </>
  );
};

export default ProductsPage;
