import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useState } from "react";

import HomePage from "../../HomePage/HomePage";
import ProductsPage from "../../Pages/ProductsPage";
import Footer from "../../Components/Footer/Footer";
import Contact from "../../Pages/Contact";
import About from "../../Pages/About";
import Location from "../../Pages/Location";
import Signup from "../../E-mail/Signup";
import Login from "../../E-mail/Login";

const Client = () => {
  const [filter, setFilter] = useState("Choose filter");
  const onMakeFilter = (f) => setFilter(f);
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<HomePage onMakeFilter={onMakeFilter} />}
        />
        <Route path="/products" element={<ProductsPage filter={filter} />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/location" element={<Location />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default Client;
