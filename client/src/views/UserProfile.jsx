import React, { useState, useEffect } from "react";
import NavBar from "./header";

const UserProfile = () => {
  const token = localStorage.getItem('token');
  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  
  useEffect(() => {
    const getUserDetails = async () => {
      const response = await fetch('http://localhost:5000/users/me', {
        method: 'GET',
        headers: {
          'X-Token': token,
        }
      });

      const data = await response.json();
      setProfileEmail(data.email)

    };

    getUserDetails();
  }, []);

  // console.log(token);
  return (
    <div className="App">
      < NavBar />
      <div className="user-profile-container">
        <div className="profile-container">
          <div className="photo-container">
            {profileEmail}
          </div>
        </div>

        <div className="profile-container">
          <div >
            <h2>Profile</h2>
            <form className="profile-information">
              <div>
                <label htmlFor="name">User name</label>
                <input
                  value={profileName}
                  onChange={(e) => e.target.value}
                  placeholder={profileName || 'No name . . .'}
                />
              </div>

              <div>
                <label htmlFor="email">Email address</label>
                <input
                  value={profileEmail}
                  onChange={(e) => e.target.value}
                  placeholder={profileEmail || 'No email'}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
};

export default UserProfile;
