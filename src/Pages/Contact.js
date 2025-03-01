import { useState } from 'react';
import './contact.css';

const Contact = () => {
  const [phone, setPhone] = useState('01');

  return (
    <div className="contact-cont">
      <h2>Contact us</h2>
      <p>Fill this form and we will call you.</p>
      <div className="form-cont">
        <form>
          <input type="text" placeholder="Name" />
          <input
            type="tel"
            placeholder="Phone number"
            value={phone}
            onChange={(e) => {
              const value = e.target.value;
              if (value.match(/^01[0125]*[0-9]{0,8}$/)) {
                setPhone(value);
              }
            }}
          />
        </form>
        <button onClick={(e) => e.preventDefault()}>Submit</button>
      </div>
    </div>
  );
}

export default Contact;
