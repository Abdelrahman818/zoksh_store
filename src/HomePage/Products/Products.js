import { useState } from "react";

const Products = (props) => {
  const handleClick = () => {
    props.onSelect(props);
  }
  return (
    <div className={false?'product low':'product'} onClick={handleClick}>
      <div className="product-img">
        <img src={props.imgDir} alt="No img" />
      </div>
      <div className="product-disc">
        <span>
          {props.productDisc}
        </span>
      </div>
      <div className="product-price">
        <span>
          {props.price} LE
        </span>
      </div>
    </div>
  );
}

export default Products;
