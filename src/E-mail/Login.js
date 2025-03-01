import React, { useState } from 'react';
import './auth.css';  // Add custom styling if needed

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validate = () => {
    const newErrors = {};
    const { username, password } = formData;

    // Username validation (can be name or phone)
    if (!username) newErrors.username = "Username (name or phone) is required";

    // Password validation
    if (!password) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      console.log("Login credentials:", formData);
      // Handle login (e.g., call an API to check credentials)
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder='Name'
            value={formData.username}
            onChange={handleInputChange}
          />
          {errors.username && <p className="error">{errors.username}</p>}

          <input
            type="password"
            name="password"
            placeholder='Password'
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
