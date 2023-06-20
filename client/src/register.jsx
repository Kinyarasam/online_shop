import React, { useState } from "react";

export const Register = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(email, password);

    console.log('--try saving--');
    
    fetch('http://localhost:5000/users/', {
      method: 'POST',
      mode: 'cors',
      headers: {
        Accept: 'Application.json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        password: password,
        name: name,
      })
    })
      .then((res) => console.log(res))
      .then((data => console.log(data)))
      .catch((err) => console.log(err))
  };


  return (
    <div className="auth-form-container">
      <h1>Register</h1>
      <form
        className="register-form"
        onSubmit={handleSubmit}
      >
        <label htmlFor="name">Full Name</label>
        <input
          value={name}
          type="text"
          onChange={(e) => setName(e.target.value)}
          placeholder="Full Name"
          id="name"
          name="name"
        />

        <label htmlFor="email">Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Enter your Email"
          id="email"
          name="email"
        />

      <label htmlFor="password">Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="***********"
          id="password"
          name="password"
        />

        <button
          // onClick={handleSubmit}
          type="submit"
          >
          Register
        </button>
      </form>

      <button
        onClick={() => props.onFormSwitch('login')}
        type="submit"
        className="link-btn"
      >
        Already have an account? Login here.
      </button>
    </div>
  )
}
