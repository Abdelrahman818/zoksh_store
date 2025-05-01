import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../Components/Loading/Loading";
import api from "../config";

import "./contact.css";

const ContactPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [errs, setErrs] = useState({
    nameErr: false,
    phoneErr: false,
  });
  const [formData, setFormData] = useState({
    type: "contact",
    user: "",
    phone: "",
    subj: "",
    msg: "",
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
    const hasNumbers = /[0-9]/;
    const hasEnglishLetters = /[a-z]/i;
    const hasArabicLetters = /[\u0600-\u06FF]/;

    const nameValidation = !hasNumbers.test(formData.user);
    const phoneValidation =
      !hasEnglishLetters.test(formData.phone) &&
      !hasArabicLetters.test(formData.phone);

    setErrs({
      name: !nameValidation,
      phone: !phoneValidation,
    });

    if (nameValidation && phoneValidation) sendData();
  };
  const sendData = () => {
    setLoading(true);

    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    const hours = String(today.getHours()).padStart(2, "0");
    const minutes = String(today.getMinutes()).padStart(2, "0");
    const date = `${day}/${month}/${year},${hours}:${minutes}`;

    fetch(api, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...formData, date }),
    }).finally(() => {
      setLoading(false);
      navigate("/");
    });
  };

  return (
    <>
      {loading && <Loading />}
      <div className="contact-page">
        <section className="contact-form">
          <h2>Send Us a Message</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="user"
              value={formData.user}
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
              name="subj"
              value={formData.subj}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select a Subject
              </option>
              <option value="Product Inquiry">Product Inquiry</option>
              <option value="Order Status">Order Status</option>
              <option value="Returns & Exchanges">Returns & Exchanges</option>
              <option value="General Feedback">General Feedback</option>
            </select>
            <textarea
              name="msg"
              value={formData.msg}
              onChange={handleChange}
              placeholder="Your Message"
              required
            />
            <button type="submit">Submit</button>
          </form>
        </section>
      </div>
    </>
  );
};

export default ContactPage;
