import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './auth.css';  // Add custom styling if needed

const Signup = () => {

  const link = 'http://localhost/zoksh-store/src/PHP/back.php';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [pwdConf, setPwdConf] = useState('');
  const [phone, setPhone] = useState('');
  const [valid, setValid] = useState(true);
  const [added, setAdded] = useState(false);
  
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    pwd: '',
    pwdConf: '',
    phone: '',
  })

  const setNewErr = (errType, err) => {
    setErrors(prevErr => ({
      ...prevErr,
      [errType]: err
    }))
  }

  const validate = () => {
    let isValid = true;
    
    if (name === '') {
      setNewErr('name', 'Name is required');
      isValid = false;
    } else if (!name.match(/^[a-z][a-z0-9]{4,16}/i)) {
      setNewErr('name', 'Name should be 4 to 16 letters');
      isValid = false;
    } else {
      setNewErr('name', '');
    }

    if (email === '') {
      setNewErr('email', 'Email is required');
      isValid = false;
    } else if (!email.match(/^[a-z][a-z0-9]*@[a-z]+\.[a-z]+/i)) {
      setNewErr('email', 'Email is invalid');
      isValid = false;
    } else {
      setNewErr('email', '');
    }

    if (pwd === '') {
      setNewErr('pwd', 'Password is required');
      isValid = false;
    } else if (!pwd.match(/[a-z0-9!@#$%&*]{8,16}/i)) {
      setNewErr('pwd', 'Password should be 8 to 16 chars');
      isValid = false;
    } else {
      setNewErr('pwd', '');
    }

    if (phone === '') {
      setNewErr('phone', 'Phone is required');
      isValid = false;
    } else if (!phone.match(/01[0125][0-9]{8,9}/)) {
      setNewErr('phone', 'Phone is invalid');
      isValid = false;
    } else {
      setNewErr('phone', '');
    }

    if (pwdConf !== pwd) {
      setNewErr('pwdConf', 'Re-type the password here');
      isValid = false;
    } else {
      setNewErr('pwdConf', '');
    }
    setValid(isValid);
  }

  const handleSubmit = e => {
    e.preventDefault();
    validate();
    sendData(link);
    setValid(false);
  }

  const sendData = async (link) => {
    if (valid) {
      fetch(link, {
        method: 'POST',
        body: JSON.stringify({
          type: 'signup',
          name: name,
          pwd: pwd,
          phone: phone,
          email: email,
        })
      }).then(res => res.json())
        .then(json => {
          if (json.msg === 'userAdded') {
            setAdded(true);
          }
        });
    }
  }

  return (
    <>
      <div className="auth-container">
        <h2>Signup</h2>
        <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder='Name'
              value={name}
              onChange={e => setName(e.target.value)}
            />
            {errors.name && <p className="error">{errors.name}</p>}

            <input
              type="email"
              name="email"
              placeholder='E-mail'
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            {errors.email && <p className="error">{errors.email}</p>}
            
            <input
              type="text"
              name="phone"
              placeholder='Phone number'
              value={phone}
              onChange={e => setPhone(e.target.value)}
            />
            {errors.phone && <p className="error">{errors.phone}</p>}

            <input
              type="pwd"
              name="pwd"
              placeholder='pwd'
              value={pwd}
              onChange={e => setPwd(e.target.value)}
            />
            {errors.pwd && <p className="error">{errors.pwd}</p>}

            <input
              type="pwd"
              name="pwdConf"
              value={pwdConf}
              placeholder="Confirm pwd"
              onChange={e => setPwdConf(e.target.value)}
            />
            {errors.pwdConf && <p className="error">{errors.pwdConf}</p>}

          <button type="submit">Sign Up</button>
        </form>
        <Link to='/login'><span className='to-sign-up'>Already have an email?</span></Link>
      </div>
      {added && 
        <div className='new-user-msg'>
          <span className='check'><i className="fa-regular fa-circle-check"></i></span>
          <span className='msg'>Account was added successfuly.</span>
        </div>
      }
    </>
  );
};

export default Signup;
