#!/usr/bin/env node
import { ObjectID } from 'mongodb'
import dbClient from "../utils/db";
import redisClient from "../utils/redis";
import Queue from 'bull';

const productQueue = new Queue(
  'productQueue',
  'redis://localhost:6379'
);

export default class ProductsController {
  static async postNew(req, res) {
    /* Get the current authenticated user */
    const token = req.header('X-Token');
    if (!token) return res.status(401).json({ error: 'Unathenticated' });

    const key = `auth_${token}`;
    const userId = await redisClient.get(key);
    
    if (!userId) return res.status(401).json({ error: 'Unathenticated' });
    // console.log(userId)
    // return res.json({type: typeof userId, len: 0 })
    
    const users = dbClient.db.collection('users');
    const idObject = new ObjectID(userId);
    return users.findOne({ _id: idObject }, async (err, user) => {
      console.log(user);
      if (err) return res.status(500).json({ error: 'Server Error' });

      if (!user) return res.status(401).json({ error: 'Unauthorized' });

      const { title, tags, vendor, product_type, name } = req.body;

      if (!title) return res.status(400).json({ error: 'Missing title' });
      if (!vendor) return res.status(400).json({ error: 'Missing vendor' });
      if (!product_type) return res.status(400).json({ error: 'Missing product_type' });

      // const created_at;
      const created_at = new Date();
      const updated_at = created_at;
      const products = await dbClient.db.collection('products');
      return products.findOne({ name }, (err, product) => {
        if (err) return res.status(500).json({ err: 'Server Error' });

        if (name) res.status(400).json({ error: `Product ${name} Already exists` });

        /* Save the new Product */
        return products.insertOne({
          name,
          title,
          created_at,
          updated_at,
          title,
          vendor,
          product_type,
        }, (err, result) => {
          if (err) return res.status(500).json({ error: `Saving Unsuccessful: ${err}` });

          productQueue.add({ productId: result.insertedId });

          return res.status(201).json({
            id: result.insertedId,
            name,
            title,
            product_type,
          })
        })
      });
    });
  }

  static async getIndex(req, res) {
    /* Get the authenticated User */
    const token = req.header('X-Token');
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const key = `auth_${token}`;
    const userId = await redisClient.get(key);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const users = dbClient.db.collection('users');
    const idObject = new ObjectID(userId);
    return users.findOne({ _id: idObject }, (err, user) => {
      if (err) return res.status(500).json({ error: `Server Error: ${err}` });

      if (!user) return res.status(401).json({ error: 'Unauthorized' });

      /* Build the aggregation pipeline for filtering and pagination */
      const pipeline = [];
      const { page } = req.query;

      pipeline.push({ $sort: { name: 1 } });

      /* Pagination using skip and limit */
      const pageSize = 20;
      const pageNumber = parseInt(page) || 0;
      const skip = pageNumber * pageSize;
      pipeline.push({ $skip: skip });
      pipeline.push({ $limit: pageSize });

      /* Execute the aggregation pipeline on the products collection */
      return dbClient.db.collection('products')
        .aggregate(pipeline)
        .toArray((err, documents) => {
          if (err) return res.status(500).json({ error: err });

          return res.status(201).json(documents.map((doc) => ({
            id: doc._id,
            name: doc.name,
            title: doc.title,
            vendor: doc.vendor,
            product_type: doc.product_type,
          })));
        })
    });
  }
}