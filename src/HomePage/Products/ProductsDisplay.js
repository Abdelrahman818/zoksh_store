import { useState } from "react";
import Products from "./Products";
import ProductShowCase from "./ProductShowCase";

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
  };
  const hideProductCase = () => {
    console.log(selectedProduct);
    setSelectedProduct(null);
  };
  const [selectedProduct, setSelectedProduct] = useState(null);
  const productsImgs = [sweatshirts, pullovers, jackets, hoodies, shirts];

  return (
    <> 
      {selectedProduct &&
        <ProductShowCase
          onClose={hideProductCase}

          />
      }
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
