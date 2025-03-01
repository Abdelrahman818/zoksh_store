import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import NavBar from './Components/Navbar';
import HomePage from './HomePage/HomePage';
import ProductsPage from './Components/ProductsPage';
import Footer from './Components/Footer/Footer';
import Contact from './Pages/Contact';
import About from './Pages/About';
import Location from './Pages/Location';
import Signup from './E-mail/Signup';
import Login from './E-mail/Login';

function App() {
  const [filter, setFilter] = useState("Choose filter");
  const onMakeFilter = (f) => {
    setFilter(f)
  }
  return (
    <>
      <Router>
        <NavBar />
        <Routes>
          <Route path='/' element={<HomePage onMakeFilter={onMakeFilter} />} />
          <Route path='/products' element={<ProductsPage filter={filter} />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/about' element={<About />} />
          <Route path='/location' element={<Location />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/login' element={<Login />} />
        </Routes>
        <Footer />
      </Router>
    </>
  );
}

export default App;
