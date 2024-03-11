import dbClient from '../utils/db';
import sha1 from 'sha1';

export default class UserController {
  static async postNew(req, res) {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }
    const user = await dbClient.client.db('files_manager').collection('users').findOne({ email: email });
    if (user) {
      return res.status(400).json({ error: 'Already exist' });
    }
    const newUser = await dbClient.client.db('files_manager').collection('users').insertOne({
      email: email,
      password: sha1(password)
    });
    return res.status(201).json({ email: newUser.email, id: newUser._id });
  }
}
