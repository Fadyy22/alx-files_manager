import redisClient from '../utils/redis';
import dbClient from '../utils/db';

export default class AppController {
  static getStatus(req, res) {
    return res.status(200).json({
      redis: redisClient.isAlive(),
      db: dbClient.isAlive(),
    });
  }

  static getStats(req, res) {
    return res.status(200).json({
      users: dbClient.nbUsers,
      files: dbClient.nbFiles,
    });
  }
}
