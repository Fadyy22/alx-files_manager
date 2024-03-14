import { ObjectId } from 'mongodb';

import dbClient from './db';
import redisClient from './redis';

export const getUserFromXToken = async (req) => {
  const token = req.headers['x-token'];
  if (!token) {
    return null;
  }
  const id = await redisClient.get(`auth_${token}`);
  if (!id) {
    return null;
  }
  const user = await dbClient.client.db().collection('users').findOne({ _id: ObjectId(id) });
  return user;
};

export const xTokenAuthentication = async (req, res, next) => {
  const user = await getUserFromXToken(req);

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  req.user = user;
  next();
};
