import { useEffect, useState } from "react";
import NavBar from "./header";

const ProductsViews = () => {
  const token = localStorage.getItem('token');
  const [products, setProducts] = useState([]);

  console.log(token)
  useEffect(() => {
    const getProducts = async () => {
      const response = await fetch('http://localhost:5000/users', {
        method: 'GET',
        headers: {
          'X-Token': token,
        }
      });

      const data = await response.json();
      console.log(data);
      // setProducts(data);
    };

    getProducts();
  }, []);

  return (
    <div className="App">
      <NavBar />
      <div className="products-container">
        <h3>Users</h3>
        
        <div>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Name</th>
                <th>Vendor</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.title}</td>
                  <td>{product.name}</td>
                  <td>{product.vendor}</td>
                  <td>{product.product_type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductsViews;
