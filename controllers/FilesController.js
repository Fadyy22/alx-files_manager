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
      const file = await dbClient.client.db()
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
    const file = await dbClient.client.db().collection('files').insertOne(fileData);
    return res.status(201).json({
      id: file.insertedId,
      userId: req.user._id,
      name,
      type,
      isPublic,
      parentId,
    });
  }

  static async getShow(req, res) {
    const fileId = req.params.id;
    const file = await dbClient.client.db().collection('files').findOne({
      _id: ObjectId(fileId),
      userId: ObjectId(req.user._id),
    });

    if (!file) {
      return res.status(404).json({ error: 'Not found' });
    }
    return res.status(200).json({
      id: fileId,
      userId: req.user._id,
      name: file.name,
      type: file.type,
      isPublic: file.isPublic,
      parentId: file.parentId,
    });
  }

  static async getIndex(req, res) {
    const parentId = req.query.parentId || 0;
    const page = +req.query.page || 0;
    const MAX_ITEMS = 20;
    const files = await dbClient.client.db().collection('files').aggregate([
      {
        $match: {
          parentId: parentId === 0 ? 0 : ObjectId(parentId),
          userId: ObjectId(req.user._id),
        },
      },
      { $skip: page * MAX_ITEMS },
      { $limit: MAX_ITEMS },
      {
        $project: {
          _id: 0,
          id: '$_id',
          userId: '$userId',
          name: '$name',
          type: '$type',
          isPublic: '$isPublic',
          parentId: '$parentId',
        },
      },
    ]).toArray();
    return res.status(200).json(files);
  }

  static async putPublish(req, res) {
    const fileFilter = {
      userId: ObjectId(req.user._id),
      _id: ObjectId(req.params.id),
    };
    const file = await dbClient.client.db()
      .collection('files')
      .findOne(fileFilter);
    if (!file) {
      return res.status(404).json({ error: 'Not found' });
    }
    await dbClient.client.db()
      .collection('files')
      .updateOne(fileFilter, { $set: { isPublic: true } });
    return res.status(200).json({
      id: req.params.id,
      userId: req.user._id,
      name: file.name,
      type: file.type,
      isPublic: true,
      parentId: file.parentId,
    });
  }

  static async putUnpublish(req, res) {
    const fileFilter = {
      userId: ObjectId(req.user._id),
      _id: ObjectId(req.params.id),
    };
    const file = await dbClient.client.db()
      .collection('files')
      .findOne(fileFilter);
    if (!file) {
      return res.status(404).json({ error: 'Not found' });
    }
    await dbClient.client.db()
      .collection('files')
      .updateOne(fileFilter, { $set: { isPublic: false } });
    return res.status(200).json({
      id: req.params.id,
      userId: req.user._id,
      name: file.name,
      type: file.type,
      isPublic: false,
      parentId: file.parentId,
    });
  }

  static async getFile(req, res) {
    const file = await dbClient.client.db().client;
  }
}
