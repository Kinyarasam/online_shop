import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "./header";

const Logout = () => {
  const [token, setToken ] = useState('');
  const [ name, setName ] = useState('');
  const [ email, setEmail ] = useState('');
  const [ id, setId ] = useState('');  
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      const authToken = localStorage.getItem('token');
      try {
        await fetch('http://localhost:5000/disconnect', {
          method: 'GET',
          headers: {
            'X-Token': authToken
          },
          mode: 'cors'
        });
      } catch (err) {
        // console.alert('Unauthenticated')
      }
      localStorage.setItem('token', '')
      setEmail(null);
      setId(null);
      setName(null);
      navigate('/')
    };

    handleLogout();
  }, []);

  return (
    <div className="App">
      < NavBar />
      Logging out failed!!!
    </div>
  )
};

export default Logout;