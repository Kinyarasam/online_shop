import React from "react";
import NavBar from './header';

/* Get a user if they are authenticated or not */
const isAuthenticated = () => {
  const token = localStorage.getItem('token');

  if (token) return true;
  return false;
}

console.log(isAuthenticated())

const UserProfile = () => {
  return (
    <div className="App">
      <NavBar />
      <div>
        This is the Authenticated User
      </div>
    </div>
  )
}

export default UserProfile;