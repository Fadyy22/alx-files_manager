import dbClient from '../utils/db';
import sha1 from 'sha1';

export default class UserController {
  static async postNew(req, res) {
    const { email, password } = req.body;

    if (!email) {
      res.status(400).json({ error: 'Missing email' });
    }
    if (!password) {
      res.status(400).json({ error: 'Missing password' });
    }
    user = await dbClient.db().collecion('users').findOne({ email: email });
    if (user) {
      res.status(400).json({ error: 'Already exist' });
    }
    newUser = await dbClient.db().collecion('users').insertOne({
      email: email,
      password: sha1(password)
    });
    return res.status(201).json({ email: newUser.email, id: newUser._id });
  }
}
