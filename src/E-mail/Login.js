import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './auth.css';

const Login = () => {

  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

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
    return json;
  };
  const validate = async () => {
    const newErrors = {};
    let valid = true;

    if (!formData.name) {
      newErrors.name = 'Username is required';
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      valid = false;
    }

    if (valid) {
      const response = await sendData();

      if (response.length === 0) {
        newErrors.name = 'The name is invalid';
      } else {
        if (response[0].pwd !== formData.password) {
          newErrors.password = 'Password is invalid';
        } else {
          saveUserInfos(response[0].name);
          navigate('/');
          window.location.reload();
        }
      }
    }
    setErrors(newErrors);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    await validate();
  };
  const saveUserInfos = (userName) => {
    localStorage.setItem('logged_in', userName)
  };

  return (
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
    </div>
  );
};

export default Login;
