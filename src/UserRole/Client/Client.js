import { Route, Routes } from "react-router-dom";
import { useState } from "react";

import HomePage from "../../HomePage/HomePage";
import ProductsPage from "../../Pages/ProductsPage";
import Footer from "../../Components/Footer/Footer";
import Contact from "../../Pages/Contact";
import About from "../../Pages/About";
import Location from "../../Pages/Location";
import Signup from "../../E-mail/Signup";
import Login from "../../E-mail/Login";
import NavBar from "../../Components/NavBar/Navbar";
import BuyPage from "../../Pages/BuyPage";

const Client = () => {
  const [filter, setFilter] = useState('');
  return (
    <>
      <NavBar />
      <Routes>
        <Route
          path="/"
          element={<HomePage currFilter={setFilter} />}
        />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/location" element={<Location />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/products-page" element={<ProductsPage filter={filter} />} />
        <Route path="/products-page/buy-page" element={<BuyPage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default Client;
