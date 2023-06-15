import React, { useState } from "react";

export const Register = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(email, password);
  };

  return (
    <div className="auth-form-container">
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
      </form>

      <button
        type="submit"
      >
        Register
      </button>

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
