import { Link } from 'react-router-dom';
import './about.css';
const About = () => {
  return (
    <div className='about'>
      <h2>About Us</h2>
      <p id="about-text">
        Welcome to <strong>ZOKSH store!</strong><br /> We believe that style starts
        with the details, which is why we offer a carefully curated collection
        of trendy clothing that combines quality, elegance, and comfort.
        <br />
        Our journey began with a clear
        vision: to provide stylish, high-quality fashion at affordable prices,
        along with a seamless and enjoyable online shopping experience.
        <br />
        <strong>Why Choose Us?</strong>
        <br />
        ✔ Trendy designs that suit all tastes
        <br />
        ✔ Premium fabrics for maximum comfort and quality
        <br />
        ✔ Dedicated customer support always ready to help
        <br />
        ✔ Fast delivery right to your doorstep
        <br />
        We’re here to help you shine on every occasion! Thank you for choosing
        <strong> ZOKSH store,</strong> and we hope you enjoy your shopping
        experience with us.
        <br />
        📩 <strong>Contact us </strong><Link to="/contact">By clicking here</Link>
      </p>
    </div>
  );
};

export default About;
