import SectionOne from "../HomePage/SectionOne";
import AvailbleProducts from "../HomePage/Products/AvailbleProducts";
import './home-page.css';

function HomePage({ currFilter }) {
  return (
    <>
      <main className='home-page'>
        <SectionOne />
        <section className="products">
          <h2>Products we sell</h2>
          <div className="availble-products">
            <AvailbleProducts getFilter={currFilter} />
          </div>
        </section>
      </main>
    </>
  );
}

export default HomePage;
