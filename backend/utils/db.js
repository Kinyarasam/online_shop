#!/usr/bin/env node
import mongodb from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();  /* Load environment variables */

const HOST = process.env.DB_HOST || 'localhost';
const PORT = process.env.DB_PORT || '27017';
const DATABASE = process.env.DB_DATABASE || 'online_store';

const url = `mongodb://${HOST}:${PORT}`;

class DBClient {
 constructor() {
    this.client = new mongodb.MongoClient(url, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });

    this.client
      .connect()
      .then(() => {
        this.db = this.client.db(DATABASE);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  /* Check the status of the Connection */
  isAlive() {
    return this.client.isConnected();
  }

  /* Returns the number of documents in the collection users */
  async nbUsers() {
    const users = this.db.collection('users');
    const numUsers = await users.countDocuments();
    return numUsers;
  }

  /* Returns the number of documents in the collection products */
  async nbProducts() {
    const products = this.db.collection('products');
    const numProducts = await products.countDocuments();
    return numProducts;
  }

  /* Returns the number of documents in the collection customers */
  async nbCustomers() {
    const customers = this.db.collection('customers');
    const numCustomers = await customers.countDocuments();
    return numCustomers;
  }
}


const dbClient = new DBClient();

export default dbClient;
