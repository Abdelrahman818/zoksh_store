import { useState } from 'react';
import { Link } from 'react-router-dom';

const AvailbleProducts = (props) => {
  const [flip, setFlip] = useState(false);

  const flipIt = () => {
    setFlip(!flip);
  }
  const onFilter = (filter) => {
    props.onMakeFilter(filter);
  }

  return (
    <div className="card-cont">
      <div className={flip?"card flip":"card"} onClick={() => flipIt()}>
        <div className="front">
          <h3 className="product-title">{props.productTitle}</h3>
          <img src={props.productImg} alt="" />
        </div>
        <div className="back">
          <p>Click on "View" button to see more about this product</p>
          <Link to='/products' style={{ textDecoration: 'none', color: '#000' }}>
            <span className="view" onClick={() => onFilter(props.productTitle)}>
              View
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AvailbleProducts;
