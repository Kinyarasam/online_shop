import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NavBar from "./header";

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

  /* Reports */
  let [noUsers, setUserno] = useState(0)
  let [noProducts, setProductsno] = useState(0)
  let [noOrders, setOrderno] = useState(0)

  useEffect(() => {
    const getRecords = async () => {
      try {
        const response = await fetch('http://localhost:5000/stats');
        const record = await response.json()
        console.log(record);

        noUsers = setUserno(record.users)
        noProducts = setProductsno(record.products)
        noOrders = setOrderno(record.orders)

      } catch (err) {
        /* Some Error */
      }
    };

    console.log(noUsers, noProducts)
    getRecords();
  }, []);

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
          <NavBar />
        </div>
        <div className="dashboard-container">
          <h3>DashBoard</h3>
          <div>Welcome {email ? email : "guest. Please login to view content"}.</div>
          <div className="analytics-card-container">
            <AnalyticsCard title='Users' value={noUsers || 0} route='/users/' />
            <AnalyticsCard title='Products' value={noProducts} route='/products/' />
            <AnalyticsCard title='Orders' value={noOrders || 0} route='/orders/' />
          </div>
        </div>
        <div>footer</div>

      </div>
    </div>
  );
};

export default DashBoard;
