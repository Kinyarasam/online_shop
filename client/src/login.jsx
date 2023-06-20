import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

export const Login = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      /* Show some Error */
      return;
    }

    const userData = `${email}:${password}`;
    const encodedData = btoa(userData);

    // console.log(encoded

    try {
      const response = await fetch('http://localhost:5000/connect', {
        method: 'GET',
        headers: {
          "Authorization": `Basic ${encodedData}`,
        },
        mode: 'cors',
      });
      const data = await response.json();
      const authToken = data.token;

      if (authToken) {
        localStorage.setItem('token', authToken);
        navigate('/dashboard');
      } else {
        /* Handle authentication error */
      }
    } catch (err) {
      console.log(err);
      /* Handle fetch error */
    }
  };

  return (
    <div className="auth-form-container">
      <h3>Login</h3>
      <form className="login-form" onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="youremail@gmail.com"
          id="email"
          name="email"
        />

        <label htmlFor="password">Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="**********"
          id="password"
          name="password"
        />

        <button type="submit">Login</button>
      </form>

      <button
        onClick={() => props.onFormSwitch('register')}
        type="button"
        className="link-btn"
      >
        Don't have an account? Register here.
      </button>
    </div>
  );
};
