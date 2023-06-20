import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const AnalyticsCard = ({ title, value, route }) => {
  return (
    <div className="analytics-card">
      <p>Number of {title}</p>
      <h4>{value}</h4>
      <Link to={route}>Explore {title} data</Link>
    </div>
  )
};


const DashBoard = () => {
  const [token, setToken] = useState('');
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userToken = localStorage.getItem('token');
        console.log(userToken)
        const response = await fetch('http://localhost:5000/users/me', {
          method: 'GET',
          headers: {
            'X-Token': userToken,
          },
          mode: 'cors'
        });
        const data = await response.json();
        console.log(data)
        setId(data.id);
        setToken(data.name);
        setEmail(data.email);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="App">
      <div>
        <div>
          <h1>header</h1>
        </div>
        <div className="auth-form-container">
          <h3>DashBoard</h3>
          <div>Welcome {email ? email : "guest. Please login to view content"}.</div>
          <div className="analytics-card-container">
            <AnalyticsCard title='Users' value='1000' route='/users/' />
            <AnalyticsCard title='Products' value='26' route='/products/' />
            <AnalyticsCard title='Orders' value='5000' route='/orders/' />
          </div>
        </div>
        <div>footer</div>

      </div>
    </div>
  );
};

export default DashBoard;
