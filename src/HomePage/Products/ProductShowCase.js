import { useState, useEffect, useContext } from "react";
import { OrderContext } from "../../context";
import { Link } from "react-router-dom";

const ProductShowCase = (props) => {

  const { setOrderData } = useContext(OrderContext);
  const [selectedImg, setSelectedImg] = useState(props.data.imgs[0]);
  const allowBuying = () => sessionStorage.setItem('buyAllow', 'true');

  useEffect(() => {
    setOrderData(props.data);
  }, [setOrderData, props.data]);

  return (
    <div className="product-show-case bg-dark">
      <div className="product-window">
        <div className="cross" onClick={() => props.onClose()}>
          <span className="r"></span>
          <span className="l"></span>
        </div>
        <div className="imgs">
          <div className="selected-img">
            <img
              src={`http://localhost/zoksh-store/src/PHP/${selectedImg}`}
              alt="can't load the img"
            />
          </div>
          <div className="product-imgs">
            {props.data.imgs.map((img, index) => (
              <img
                key={index}
                src={`http://localhost/zoksh-store/src/PHP/${img}`}
                alt=""
                onClick={() => setSelectedImg(img)}
                className={selectedImg === img ? "active-img" : ""}
              />
            ))}
          </div>
        </div>
        <span className="line-separator"></span>
        <div className="product-infos">
          <div className="product-name">
            <h3>{props.data.name}</h3>
          </div>
          <div className="product-disc">
            <p>{props.data.infos}</p>
          </div>
          <div className="btns-cont">
            <Link to={"buy-page"}><div className="buy" onClick={allowBuying}>Buy now</div></Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductShowCase;
