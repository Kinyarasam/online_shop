#!/usr/bin/env node
import sha1 from 'sha1';
import Queue from 'bull';
import { ObjectID } from 'mongodb'
import dbClient from "../utils/db";
import redisClient from '../utils/redis';

const usersQueue = new Queue(
  'usersQueue',
  'redis://localhost:6379'
);

export default class UsersController{
  /**
   * 
   * @param {*} req 
   * @param {*} res 
   * @returns 
   */
  static postNew(req, res) {
    const { email } = req.body;
    const { password } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }

    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    const users = dbClient.db.collection('users');
    return users.findOne({ email }, async (err, user) => {
      if (err) throw err;

      if (user) {
        return res.status(400).json({error: 'Already exist'});
      }

      const hashedPassword = sha1(password);

      /* Save the new User. */
      return users.insertOne({ email, password: hashedPassword }, (err, result) => {
        if (err) throw err;

        usersQueue.add({ userId: result.insertedId });
        return res.status(201).json({
          id: result.insertedId,
          email
        });
      });
    })
  }

  /**
   * retrieve the user base on the token 
   * @param {*} req 
   * @param {*} res 
   * @returns 
   */
  static async getMe(req, res) {
    const token = req.header('X-Token');
    const key = `auth_${token}`;
    const userId = await redisClient.get(key);

    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const idObject = new ObjectID(userId)
    const users = await dbClient.db.collection('users');
    return users.findOne({ _id: idObject }, (err, user) => {
      if (err) throw err;

      if (!user) return res.status(401).json({ error: 'Unauthorized' });

      return res.status(200).json({ id: user._id, email: user.email })
    });
  }
}