import sha1 from 'sha1';
import { v4 } from 'uuid';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

export default class AuthController {
  static async getConnect(req, res) {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const authorizationParts = authorization.split(' ');
    if (authorizationParts[0] !== 'Basic' || authorizationParts.length !== 2) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const decodedToken = Buffer.from(authorizationParts[1], 'base64').toString();
    if (!decodedToken.includes(':')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const credentials = decodedToken.split(':');
    const user = await dbClient.client
      .db('files_manager')
      .collection('users')
      .findOne({ email: credentials[0], password: sha1(credentials[1]) });

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const token = v4();
    await redisClient.set(`auth_${token}`, user._id, 24 * 60 * 60);
    return res.status(200).json({ token });
  }

  static async getDisconnect(req, res) {
    const token = req.headers['x-token'];
    await redisClient.del(`auth_${token}`);
    return res.status(204).send();
  }
}
