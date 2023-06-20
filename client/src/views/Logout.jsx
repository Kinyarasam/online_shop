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
    // const disconnectUser = async () => {
    //   try {
    //     const AuthenticatedUser = localStorage.getItem('token');
    //     console.log(AuthenticatedUser);

    //     const response = await fetch('http://localhost:5000/disconnect', {
    //       method: 'GET',
    //       headers: {
    //         'X-Token': AuthenticatedUser
    //       },
    //       mode: 'cors'
    //     })
    //     const data = await response.json()
    //     console.log(data || 'no data')
    //     // setToken(data)
    //     if (AuthenticatedUser) {
    //       localStorage.removeItem('token')
    //       setToken(token)
    //     } else {
    //       console.log('Not authenticated')
    //     }
    //   } catch (err) {
    //     console.log(err);
    //     navigate('/')
    //   }

    //   console.log(token);

      // navigate('/auth')
    // };
    // console.log(token)

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