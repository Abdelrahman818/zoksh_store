import React, { useState } from "react";

import Loading from '../Components/Loading/Loading';

import "./contact.css";

const ContactPage = () => {
  const [loading, setLoading] = useState(false);
  const [errs, setErrs] = useState({
    nameErr: false,
    phoneErr: false,
    msg: false,
  });
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
    validation();
  };
  const validation = () => {
    const nameRe = /[a-z]{3,16}/i;
    const phoneRe = /[0-9]{11,12}/;
    const msgRe = /[a-z]{4,255}/i;

    let obj = {};
    let nameValidation;
    let phoneValidation;
    let msgValidation;

    if (formData.name.match(nameRe)) nameValidation = false;
    else nameValidation = true;
    if (formData.phone.match(phoneRe)) phoneValidation = false;
    else phoneValidation = true;
    if (formData.message.match(msgRe)) msgValidation = false;
    else msgValidation = true;

    obj.name = nameValidation;
    obj.phone = phoneValidation;
    obj.msg = msgValidation;

    setErrs(obj);
    if (nameValidation && phoneValidation && msgValidation) {
      setLoading(true);
      sendData();
    }
    console.log(errs);
  };
  const sendData = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    const hours = String(today.getHours()).padStart(2, "0");
    const minutes = String(today.getMinutes()).padStart(2, "0");
    const date = `${day}/${month}/${year},${hours}:${minutes}`;
    fetch('http://localhost/zoksh-store/src/PHP/back.php', {
      method: "POST",
      body: JSON.stringify({
        type: "contact",
        name: formData.name,
        phone: formData.phone,
        subj: formData.subject,
        msg: formData.message,
        date: date,
      }),
    })
      .then((res) => res.json())
      .then((json) => console.log(json))
      .finally(() => setLoading(false));
  };
  return (
    <>
      { loading && <Loading /> }
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
            {errs.name && <div className="err">This name is invalid</div>}
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Your Phone"
              required
            />
            {errs.phone && <div className="err">This phone is invalid</div>}
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
            {errs.msg && <div className="err">The message is very long</div>}
            <button type="submit">Submit</button>
          </form>
        </section>
      </div>
    </>
  );
};

export default ContactPage;
