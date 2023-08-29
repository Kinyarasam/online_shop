#!/usr/bin/env node
import sha1 from 'sha1';
import { v4 as uuidv4 } from 'uuid';
import dbClient from "../utils/db";
import redisClient from '../utils/redis';
// import Buffer from 'Buffer';

export default class AuthController {
  static async getConnect(req, res) {
    const isAuthenticated = req.header('Authorization');

    const authData = isAuthenticated.split(' ')[1];
    const buf = Buffer.from(authData, 'base64');
    const userData = buf.toString('utf-8')

    const data = userData.split(":")

    if (data.length !== 2) return res.status(401).json({ error: 'Unauthorized' });

    const email = data[0];
    const hashedPassword = sha1(data[1]);

    const users = await dbClient.db.collection('users');
    return users.findOne({ email: email, password: hashedPassword }, async (err, user) => {
      if (err) throw err;

      if (!user) return res.status(401).json({ error: 'Unauthorized' });

      const token = uuidv4();
      const key = `auth_${token}`;

      await redisClient.set(key, user._id.toString(), 60 * 60 * 24);
      return res.status(200).json({ token: token });
    });
  }

  static async getDisconnect(req, res) {
    const token = req.header('X-Token');
    const key = `auth_${token}`;
    const userId = await redisClient.get(key);

    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    await redisClient.del(key);

    return res.status(204).json({});
  }
}
