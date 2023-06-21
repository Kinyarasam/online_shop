import React, { useEffect, useState } from "react";
import logo from '../logo.svg';
import { Link, useNavigate } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [id, setId] = useState('');
  const [token, setToken] = useState('');
  const [loggedIn, setIsLoggedIn] = useState('');

  useEffect(() => {
    const isAuthenticated = async () => {
      try {
        const authToken = localStorage.getItem('token');
  
        const response = await fetch('http://localhost:5000/users/me', {
          method: 'GET',
          headers: {
            'X-Token': authToken
          },
          mode: 'cors'
        });
        const data = await response.json();
        setToken(authToken)
        return data.error ? false : true;

      } catch (err) {
        return false;
      }
    };

    isAuthenticated()
      .then(res => setIsLoggedIn(res))
  }, []);

  if (loggedIn === false) navigate('/auth');

  return (
    <header className="navbar">
      <div className="logo-container">
        <img src={logo} alt='Logo' className="logo" />
      </div>
      {loggedIn}
      <nav className="nav-links">
        <ul>
          <li>
            <Link to='/'>Home</Link>
          </li>
          {
            loggedIn ? <>
              <li>
                <Link to='/profile'>Profile</Link>
              </li>
              <li
                // onClick={handleLogout}
              >
                <Link to='/logout'>logout</Link>
              </li>
            </> : <>
              <li>
                <Link to='/auth'>Login</Link>
              </li>
            </>
          }
          
        </ul>
      </nav>
    </header>
  )
};

export default NavBar;
