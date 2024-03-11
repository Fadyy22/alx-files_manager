import dbClient from './db';
import redisClient from './redis';

export const getUserFromXToken = async (req, res, next) => {
  const token = req.headers['X-Token'];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const id = await redisClient.get(`auth_${token}`);
  if (!id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const user = await dbClient.client.db('files_manager').collection('users').findOne({ _id: id });
  req.user = user;
  next();
};

export default { getUserFromXToken };
