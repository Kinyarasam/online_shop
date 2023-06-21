import React from "react";
import NavBar from "./header";

const UsersViews = () => {
  const token = localStorage.getItem('token');
  console.log(token);
  return (
    <div className="App">
      < NavBar />
      Users Default view
    </div>
  )
};

export default UsersViews;
