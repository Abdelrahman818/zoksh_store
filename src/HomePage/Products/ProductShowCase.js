const ProductShowCase = (props) => {
  return (
    <div className="product-show-case bg-dark">
      <div className="product-window">
        <div className="cross" onClick={ props.onClose }>
          <span className="r"></span>
          <span className="l"></span>
        </div>
        <div className="imgs">
          <div className="selected-img">
            {/* <img src={require(props.imgPath)} alt="can't load the img" /> */}
          </div>
          <div className="product-imgs">
            {/* {props.imgs.map((e) => {return e;})} */}
          </div>
        </div>
        <span className="line-separator"></span>
        <div className="product-disc">
          {/* <p>{props.productDisc}</p> */}
        </div>
        <div className="btns-cont">
          <div className="buy">Buy now</div>
          <div className="bskt">Add to basket</div>
        </div>
      </div>
    </div>
  );
}

export default ProductShowCase;
