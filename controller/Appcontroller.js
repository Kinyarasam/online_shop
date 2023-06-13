#!/usr/bin/env node
import dbClient from "../utils/db";
import redisClient from "../utils/redis";

export default class AppController {
  static getStatus(req, res) {
    return res.status(200).json({
      redis: redisClient.isAlive(),
      db: dbClient.isAlive(),
    });
  }

  static async getStats(req, res) {
    const numUsers = await dbClient.nbUsers();
    const numProducts = await dbClient.nbProducts();
    const numCustomers = await dbClient.nbCustomers();

    return res.status(200).json({
      users: numUsers,
      products: numProducts,
      customers: numCustomers,
    });
  }
}
