#!/usr/bin/env node
import { ObjectID } from 'mongodb';
import dbClient from "../utils/db";
import redisClient from "../utils/redis";

export default class CustomersController {
  static async getIndex(req, res) {
    const token = req.header('X-Token');
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    
    const key = `auth_${token}`;
    return res.status(200).json({ msg: key });
    const userId = redisClient.get(key);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    
    const idObject = new ObjectID(userId);
    return res.status(200).json({ idObject })
  }

  /**
   * Add a new Customer.
   * @param {*} req 
   * @param {*} res 
   */
  static async postNew(req, res) {
    const token = req.header('X-Token');
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const key = `auth_${token}`;
    const userId = await redisClient.get(key);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const users = dbClient.db.collection('users');
    const idObject = new ObjectID(userId);
    return users.findOne({ _id: idObject }, (err, user) => {
      if (err) return res.status(500).json({ error: 'Server Error' });

      if (!user) return res.status(401).json({ error: 'Unauthorized' });

      const {
        first_name,
        isAdmin,
        last_name,
        email,
        state,
        alternative_email,
        phone,
        accepts_marketting,
      } = req.body;

      if (!first_name) return res.status(400).json({ error: 'missing first name' });
      if (!last_name) return res.status(400).json({ error: 'missing last name' });
      if (!email) return res.status(400).json({ error: 'missing email' });
      if (!last_name) return res.status(400).json({ error: 'missing last name' });

      const customers = dbClient.db.collection('customers');
      return customers.findOne({ email }, (err, customer) => {
        if (err) return res.status(500).json({ error: 'Server error' });

        if (customer) return res.status(400).json({ error: 'Already exists' });

        const allowedStates = ['active', 'disabled'];
        const isAllowedState = (state) => {
          return state ? allowedStates.includes(state) : 'disabled'
        };
        const created_at = new Date();
        const updated_at = created_at;
        const cusAttr = {
          first_name,
          last_name,
          email,
          alternative_email,
          isAdmin: isAdmin || false,
          created_at,
          updated_at,
          phone: phone || 0,
          state: isAllowedState(state),
          accepts_marketting: accepts_marketting || false,
          isVerified: isVerified || false,
        }

        return customers.insertOne(cusAttr, (err, result) => {
          if (err) return res.status(500).json({ error: err });

          return res.status(201).json({
            id: result.insertedId,
            first_name,
            last_name,
            email,
            phone,
            state
          });
        })
      });
    });
  }
}
