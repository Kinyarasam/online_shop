#!/usr/bin/env node
import redis from 'redis';
import util from 'util';

class RedisClient {
  constructor() {
    this.client = redis.createClient();

    /* display any errors on the console */
    this.client.on('error', (err) => {
      console.log(err);
    })

    this.client.on('connect', () => {
      /* Connected */
    })
  }

  isAlive() {
    return this.client.connected;
  }

  async get(key) {
    const redisGet = util.promisify(this.client.get).bind(this.client);
    const value = await redisGet(key);
    return value;
  }

  async set(key, value, time) {
    const redisSet = util.promisify(this.client.setex).bind(this.client);
    return redisSet(key, time, value);
  }

  // del key value pair from redis server.
  async del(key) {
    const redisDel = util.promisify(this.client.del).bind(this.client);
    await redisDel(key);
  }
}

const redisClient = new RedisClient();

export default redisClient;
