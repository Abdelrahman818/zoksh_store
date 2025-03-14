import React, { useState } from "react";

import './contact.css';
import { Link } from "react-router-dom";

const ContactPage = () => {
  const [storePhone, setStorePhone] = useState('+02 0100 663 4977');
  const [storeEmail, setStoreEmail] = useState('support@zoksh_store.com');
  const [storeAdress, setStoreAdress] = useState('The adress');
  const [workingTime, setWorkingTime] = useState('Mon-Fri: 9 AM - 6 PM');
  const [loggedIn, setLoggedIn] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    subject: "",
    message: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  const loginCheck = () => {
    sendData()
    if (localStorage.getItem('logged_in')) {
      setLoggedIn(true);
    }
    else {setLoggedIn(false)}
  };
  const sendData = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    const hours = String(today.getHours()).padStart(2, '0');
    const minutes = String(today.getMinutes()).padStart(2, '0');
    const date = `${day}/${month}/${year},${hours}:${minutes}`;
    fetch('http://localhost/zoksh-store/src/PHP/back.php', {
      method: 'POST',
      body: JSON.stringify({
        type: 'contact',
        user: localStorage.getItem('logged_in'),
        name: formData.name,
        phone: formData.phone?formData.phone:null,
        subj: formData.subject,
        msg: formData.message,
        date: date,
      })
    }).then(res => res.json())
      .then(json => console.log(json))
  }

  return (
    <div className="contact-page">
      <section className="contact-form">
        <h2>Send Us a Message</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            required
          />
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Your Phone (Optional)"
          />
          <select
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
          >
            <option value="">Select a Subject</option>
            <option value="Product Inquiry">Product Inquiry</option>
            <option value="Order Status">Order Status</option>
            <option value="Returns & Exchanges">Returns & Exchanges</option>
            <option value="General Feedback">General Feedback</option>
          </select>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Your Message"
            required
          />
          <button type="submit" onClick={loginCheck}>Submit</button>
        </form>
      </section>
      {!loggedIn&&
        <div className="parent bg-dark">
          <div className="login-msg bg-light">
            <span>Please Login first to be able to contact us.</span>
            <div className="btns">
              <Link to='/login'><span className="ok">OK</span></Link>
              <span className="leater" onClick={() => setLoggedIn(true)}>Leater</span>
            </div>
          </div>
        </div>}
    </div>
  );
};

export default ContactPage;
