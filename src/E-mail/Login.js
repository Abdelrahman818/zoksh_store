import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Loading from '../Components/Loading/Loading';

import './auth.css';

const Login = () => {

  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    password: '',
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const sendData = async () => {
    const response = await fetch('http://localhost/zoksh-store/src/PHP/back.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'login',
        name: formData.name,
        pwd: formData.password,
      }),
    });
    const json = await response.json();
    console.log(json);
    setLoading(false);
    return json;
  };
  const validate = async () => {
    const newErrors = {};
    let valid = true;

    if (!formData.name) {
      newErrors.name = 'Username is required';
      valid = false;
    } if (!formData.password) {
      newErrors.password = 'Password is required';
      valid = false;
    } if (valid) {
      setLoading(true);
      const response = await sendData();

      if (response.msg === 'invPwd') {
        newErrors.password = 'Invalid password';
      } else if (response.msg === 'invUsr') {
        newErrors.name = 'User name is not valid';
      } else if (response.msg === 'loginSuccess') {
        localStorage.setItem('authToken', response.token);
        navigate('/');
        window.location.reload();
      }
    }
    setErrors(newErrors);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    await validate();
  };

  return (
    <>
      { loading && <Loading /> }
      <div className="auth-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Username"
            value={formData.name}
            onChange={handleInputChange}
          />
          {errors.name && <p className="error">{errors.name}</p>}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
          />
          {errors.password && <p className="error">{errors.password}</p>}

          <button type="submit">Login</button>
        </form>
        <Link to={'/signup'}><span className='new-acc'>Create new account</span></Link>
      </div>
    </>
  );
};

export default Login;
