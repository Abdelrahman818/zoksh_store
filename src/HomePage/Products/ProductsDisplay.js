import { useState } from "react";
import Products from "./Products";

const DisplayProducts = ({ filter }) => {
  const sweatshirts = require.context(
    "../../imgs/products/Sweatshirts/Sweatshirts",
    false,
    /\.(png|jpe?g|gif)$/
  );
  const pullovers = require.context(
    "../../imgs/products/Pullovers/Pullovers",
    false,
    /\.(png|jpe?g|gif)$/
  );
  const hoodies = require.context(
    "../../imgs/products/Hoodies/Hoodies",
    false,
    /\.(png|jpe?g|gif)$/
  );
  const jackets = require.context(
    "../../imgs/products/Jackets/Jackets",
    false,
    /\.(png|jpe?g|gif)$/
  );
  const shirts = require.context(
    "../../imgs/products/Shirts/Shirts",
    false,
    /\.(png|jpe?g|gif)$/
  );
  const productsImgs = [sweatshirts, pullovers, jackets, hoodies, shirts];

  const productsImgsObj = {
    Sweatshirts: sweatshirts,
    Pullovers: pullovers,
    Hoodies: hoodies,
    Jackets: jackets,
    Shirts: shirts,
  };

  const renderProducts = (category) => {
    const images = productsImgsObj[category];
    return images.keys().map((imagePath, index) => {
      return (
        <Products
          key={index}
          imgDir={images(imagePath)}
          productDisc={"Buy this product now"}
          price={"10,000"}
          onSelect={chooseProduct}
        />
      );
    });
  };
  const chooseProduct = (product) => {
    setSelectedProduct(product);
  }
  const hideProductCase = () => {
    setSelectedProduct(null);
  }
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <> 
      {selectedProduct?
        <div className="product-show-case bg-dark">
          <div className="product-window">
            <div className="cross" onClick={hideProductCase}>
              <span className="r"></span>
              <span className="l"></span>
            </div>
            <div className="imgs">
              <div className="selected-img">
              
              </div>
              <div className="product-imgs">
                
              </div>
            </div>
            <span className="line-separator"></span>
            <div className="product-disc">
              <p></p>
            </div>
            <div className="btns-cont">
              <div className="buy">Buy now</div>
              <div className="bskt">Add to basket</div>
            </div>
          </div>
        </div>
        :''}
      {filter === "Choose filter"
        ? productsImgs.map((element) => {
            return element.keys().map((e, index) => {
              return (
                <Products
                  key={index}
                  imgDir={element(e)}
                  productDisc={"Please buy them all"}
                  price={"10,000"}
                  onSelect={chooseProduct}
                />
              );
            });
          })
        : filter in productsImgsObj
        ? renderProducts(filter)
        : null}
    </>
  );
};

export default DisplayProducts;
