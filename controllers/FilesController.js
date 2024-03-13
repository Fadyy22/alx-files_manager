import fs from 'fs';
import { v4 } from 'uuid';
import { ObjectId } from 'mongodb';
import dbClient from '../utils/db';

export default class FilesController {
  static async postUpload(req, res) {
    const TYPES = ['folder', 'file', 'image'];
    const { name, type, data } = req.body;
    const parentId = req.body.parentId || 0;
    const isPublic = req.body.isPublic || false;
    if (!name) {
      return res.status(400).json({ error: 'Missing name' });
    }
    if (!type || !TYPES.includes(type)) {
      return res.status(400).json({ error: 'Missing type' });
    }
    if (!data && type !== 'folder') {
      return res.status(400).json({ error: 'Missing data' });
    }
    if (parentId) {
      const file = await dbClient.client.db('files_manager')
        .collection('files')
        .findOne({
          _id: ObjectId(parentId),
        });
      if (!file) {
        return res.status(400).json({ error: 'Parent not found' });
      }
      if (file.type !== 'folder') {
        return res.status(400).json({ error: 'Parent is not a folder' });
      }
    }
    const path = process.env.FOLDER_PATH || '/tmp/files_manager/';
    const fileName = v4();
    const filePath = path + fileName;
    const fileData = {
      userId: req.user._id,
      name,
      type,
      isPublic,
      parentId,
    };
    if (type === 'folder') {
      fs.mkdirSync(filePath);
    } else {
      fs.writeFileSync(filePath, Buffer.from(data, 'base64').toString());
      fileData.localPath = filePath;
    }
    const file = await dbClient.client.db('files_manager').collection('files').insertOne({
      fileData,
    });
    return res.status(201).json({
      id: file.insertedId,
      userId: req.user._id,
      name,
      type,
      isPublic,
      parentId,
    });
  }
}
