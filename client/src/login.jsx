import React, { useState } from "react";
// import Buffer from 'buffer';

export const Login = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      /* Show some Error */
    }
    
    const userData = `${email}:${password}`;
    const data = btoa(userData);
    console.log(data);

    fetch('http://localhost:7000/connect', {
      method: 'GET',
      headers: {
        "Authorization": `Basic ${data}`,
      },
      mode: 'cors',
    })
      .then(res => res.json())
      .then(data => console.log(data))
      .catch((err) => console.log(err))
    // const validation = await fetch({
    //   url: 'http://localhost:7000/users',
    //   method: 'GET',
    //   mode: "cors",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     email: email,
    //     password: password,
    //   })
    // }, (err, results) => {
    //   if (err) throw err;

    //   return results;
    // });
    // validate password
    // console.log(validation);

    console.log(email);
  };

  return (
    <div className="auth-form-container">
      <h3>Login</h3>
      <form
        className="login-form"
        onSubmit={handleSubmit}
      >
        <label htmlFor="email">Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type='email'
          placeholder="youremail@gmail.com"
          id="email"
          name="email"
        />

        <label htmlFor="password">Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type='password'
          placeholder="**********"
          id="password"
          name="password"
        />

        <button
          type="submit"
        >
          Login
        </button>
      </form>

      <button
        onClick={() => props.onFormSwitch('register')}
        type="submit"
        className="link-btn"
      >
        Don't have an account? Register here.
      </button>
    </div>
  )
}
