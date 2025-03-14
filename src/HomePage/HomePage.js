import { useState } from "react";
import SectionOne from "../HomePage/SectionOne";
import AvailbleProducts from "../HomePage/Products/AvailbleProducts";

import shirtsImg from '../imgs/products/Shirts/ShirtTempleat.jpeg';
import hoodiImg from '../imgs/products/Hoodies/HoodiTempleat.jpeg';
import jacketImg from '../imgs/products/Jackets/JacketTempleat.jpeg';
import pulloverImg from '../imgs/products/Pullovers/PulloverTempleat.jpeg';
import sweatshirtImg from '../imgs/products/Sweatshirts/PulloverTempleat.jpeg';

import './home-page.css';

function HomePage({ onMakeFilter }) {
  const imgs = {
    'Shirts': shirtsImg,
    'Hoodies': hoodiImg,
    'Jackets': jacketImg,
    'Pullovers': pulloverImg,
    'Sweatshirts': sweatshirtImg,
  };

  return (
    <>
      <main>
        <SectionOne />
        <section className="products">
          <h2>Products we sell</h2>
          <div className="availble-products">
            {
              Object.entries(imgs).map(([key, val], index) => {
                return (
                  <AvailbleProducts
                    key={index}
                    productTitle={key}
                    productImg={val}
                    onMakeFilter={onMakeFilter} />
                  );
                })
              }
          </div>
        </section>
      </main>
    </>
  );
}

export default HomePage;
