import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Loading from '../Components/Loading/Loading';
import api from "../config";

import './auth.css';

const Signup = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [pwdConf, setPwdConf] = useState('');
  const [phone, setPhone] = useState('');
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    pwd: '',
    pwdConf: '',
    phone: '',
  });
  const setNewErr = (errType, err) => {
    setErrors(prevErr => ({
      ...prevErr,
      [errType]: err
    }));
  };
  const validate = () => {
    let isValid = true;

    // Validate Name
    if (!name.trim()) {
      setNewErr('name', 'Name is required');
      isValid = false;
    } else if (!name.match(/^[a-z][a-z0-9]{3,15}$/i)) {
      setNewErr('name', 'Name should be 4 to 16 letters');
      isValid = false;
    } else setNewErr('name', '');

    // Validate Email
    if (!email.trim()) {
      setNewErr('email', 'Email is required');
      isValid = false;
    } else if (!email.match(/^[a-z][a-z0-9._]*@[a-z]+\.[a-z]+$/i)) {
      setNewErr('email', 'Email is invalid');
      isValid = false;
    } else setNewErr('email', '');

    // Validate Phone
    if (!phone.trim()) {
      setNewErr('phone', 'Phone is required');
      isValid = false;
    } else if (!phone.match(/^01[0125][0-9]{8}$/)) {
      setNewErr('phone', 'Phone is invalid');
      isValid = false;
    } else setNewErr('phone', '');

    // Validate Password
    if (!pwd) {
      setNewErr('pwd', 'Password is required');
      isValid = false;
    } else if (!pwd.match(/^[a-z0-9!@#$%&*]{8,16}$/i)) {
      setNewErr('pwd', 'Password should be 8 to 16 chars');
      isValid = false;
    } else setNewErr('pwd', '');

    // Validate Password Confirmation
    if (pwdConf !== pwd) {
      setNewErr('pwdConf', 'Passwords do not match');
      isValid = false;
    } else setNewErr('pwdConf', '');

    return isValid;
  };
  const handleSubmit = e => {
    e.preventDefault();
    if (validate()) {
      setLoading(true);
      sendData();
    }
  };
  const sendData = async () => {
    fetch(api, {
      method: 'POST',
      body: JSON.stringify({
        type: 'signup',
        name,
        pwd,
        phone,
        email,
      })
    }).then(res => res.json())
      .then(json => {
        if (json.msg === 'userAdded') {
          setAdded(true);
          localStorage.setItem('authToken', json.token);
          navigate('/');
          window.location.reload();
        } else if (json.msg === 'nameErr') {
          setNewErr('name', 'Name already exists');
        } else if (json.msg === 'emailErr') {
          setNewErr('email', 'Email is already taken');
        } else if (json.msg === 'phoneErr') {
          setNewErr('phone', 'Phone number already registered');
        } else if (json.msg === 'pwdErr') {
          setNewErr('pwd', 'Password does not meet requirements');
        } else if (json.msg === 'pwdConfErr') {
          setNewErr('pwdConf', 'Passwords do not match');
        }
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      { loading && <Loading /> }
      <div className="auth-container">
        <h2>Signup</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
          {errors.name && <p className="error">{errors.name}</p>}
          <input type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} />
          {errors.email && <p className="error">{errors.email}</p>}
          <input type="text" placeholder="Phone number" value={phone} onChange={e => setPhone(e.target.value)} />
          {errors.phone && <p className="error">{errors.phone}</p>}
          <input type="password" placeholder="Password" value={pwd} onChange={e => setPwd(e.target.value)} />
          {errors.pwd && <p className="error">{errors.pwd}</p>}
          <input type="password" placeholder="Confirm Password" value={pwdConf} onChange={e => setPwdConf(e.target.value)} />
          {errors.pwdConf && <p className="error">{errors.pwdConf}</p>}
          <button type="submit">Sign Up</button>
        </form>

        <Link to='/login'><span className='to-sign-up'>Already have an account?</span></Link>
      </div>

      {added && 
        <div className='new-user-msg'>
          <span className='check'><i className="fa-regular fa-circle-check"></i></span>
          <span className='msg'>Account was added successfully.</span>
        </div>
      }
    </>
  );
};

export default Signup;
