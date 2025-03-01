
const SectionOne = () => {
  return (
    <section className="home-page">
      <div className="first-photo">
        <img src={require("../imgs/Untitled-design-(3).png")} alt="" />
      </div>
      <div className="toy">
        <span className="shirt" href="#s">
          <i className="fa-solid fa-shirt"></i>
        </span>
        <span className="pant" href="#p">
          <span className="top"></span>
          <span className="left-out"></span>
          <span className="right-out"></span>
          <span className="btm-left"></span>
          <span className="btm-right"></span>
          <span className="left-in"></span>
          <span className="right-in"></span>
        </span>
      </div>
      <div className="discreption">
        <span>Style, Comfort, Trendy, Fashion, Quality</span>
      </div>
    </section>
  );
}

export default SectionOne;
