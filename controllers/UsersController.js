import sha1 from 'sha1';
import dbClient from '../utils/db';

export default class UserController {
  static async postNew(req, res) {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }
    const user = await dbClient.client.db('files_manager').collection('users').findOne({ email });
    if (user) {
      return res.status(400).json({ error: 'Already exist' });
    }
    const newUser = await dbClient.client.db('files_manager').collection('users').insertOne({
      email,
      password: sha1(password),
    });
    return res.status(201).json({ email: newUser.ops[0].email, id: newUser.insertedId });
  }
}
