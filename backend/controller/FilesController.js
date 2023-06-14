#!/usr/bin/env node
import { ObjectID } from 'mongodb';
import { Buffer } from 'buffer';
import { v4 as uuidv4 } from 'uuid';
import Queue from 'bull';
import dotenv from 'dotenv';
import fs from 'fs';
import dbClient from "../utils/db";
import redisClient from "../utils/redis";

dotenv.config();  /* Load the environment variables */

const filesQueue = new Queue(
  'fileQueue',
  'redis://localhost:6379',
);

export default class FilesController {
  static async postUpload(req, res) {
    /* Retrieve a user */
    const token = req.header('X-Token');
    const key = `auth_${token}`;
    const userId = await redisClient.get(key);

    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const users = await dbClient.db.collection('users');
    const idObject = new ObjectID(userId);
    return users.findOne({ _id:  idObject }, async (err, user) => {
      if (err) throw err;

      if (!user) return res.status(401).json({ error: 'Unauthorized' });

      const { name } = req.body;
      const { type } = req.body;
      const { parentId } = req.body;
      const { isPublic } = req.body;
      const { data } = req.body;

      if (!name) return res.status(400).json({ error: 'Missing name' });
      
      const validTypes = ['folder', 'file', 'image'];
      const isValidType = (type) => true ? validTypes.includes(type) : undefined;
      if (!type || isValidType == undefined) return res.status(400).json({ error: 'Missing type' });
      
      if (!data && type !== 'folder') return res.status(400).json({ error: 'Missing Data' });

      const files = await dbClient.db.collection('files');

      if (!parentId) {
        const filePath = process.env.FOLDER_PATH || '/tmp/online_store/';

        const fileName = `${filePath}${uuidv4()}`;

        /**
         * Check if folder exists.
         * @function isDirectory
         * @param {*} folderPath
         * @returns {boolean}
         */
        const isDirectory = (folderPath) => {
          try {
            return fs.statSync(folderPath).isDirectory()
          } catch (err) {
            return false;
          }
        };

        /* create a folder */
        if (!isDirectory(filePath)){
          try {
            fs.mkdir(filePath, (err) => {
              if (err) throw err;
              // console.log('Created Successfully');
            });
          } catch (err) {
            if (err) throw err;
          }
        }

        /**
         * Check if the data is valid base64
         * @param {*} dataMes 
         * @returns 
         */
        const isValidData = (dataMes) => {
          try {
            return Buffer.from(dataMes, 'base64').toString('utf-8');
          } catch (err) {
            return '';
          }
        }

        const fileContent = isValidData(data);

        /* Store the data in a file */
        try {
          fs.writeFile(fileName, fileContent, (err) => {
            if (err) throw err;
          })
        } catch (err) {
          if (err) throw err;
        }

        const attr = {
          userId,
          name,
          type,
          isPublic: isPublic || false,
          parentId: parentId || 0,
          localPath: fileName,
        }

        /* Save the file in DB */
        return files.insertOne(attr, (err, dbFile) => {
          if (err) throw err;

          filesQueue.add({ fileId: dbFile.insertedId });
          return res.status(201).json({
            id: dbFile.insertedId,
            userId,
            name,
            type,
            isPublic: isPublic || false,
            parentId: parentId || 0,
          });
        });
      }

      const idObject = new ObjectID(parentId);

      return files.findOne({ _id: idObject }, (err, file) => {
        if (err) throw err;

        if (!file) return res.status(400).json({ error: 'Parent not found' });

        if (file.type !== 'folder') return res.status(400).json({ error: 'Parent is not a folder' });

        const fAttr = {
          userId,
          name,
          type,
          isPublic,
          parentId,
          localPath: file.localPath,
        };

        return files.insertOne(fAttr, (err, dbFile) => {
          if (err) throw err;

          filesQueue.add({ fileId: dbFile.insertedId });
          return res.status(201).json({
            id: dbFile.insertedId,
            userId,
            name,
            type,
            isPublic,
            parentId,
          });
        });
      });
    });
  }

  /**
   * Retrieve user file documents for a specific parentId
   * and with pagination
   * @param {*} req 
   * @param {*} res 
   */
  static async getIndex(req, res) {
    const token = req.header('X-Token');
    const key = `auth_${token}`;
    const userId = await redisClient.get(key);
    
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    
    const idObject = new ObjectID(userId);
    const users = await dbClient.db.collection('users');
    return users.find({ _id: idObject }, async (err, user) => {
      if (err) throw err;
      
      if (!user) return res.status(401).json({ error: 'Unauthorized' });
      
      const { parentId, page } = req.query;
      console.log(parentId, page)
      const files = await dbClient.db.collection('files');
      return files
        .find({userId})
        .limit(20)
        .toArray((err, doc) => {
            if (err) throw err;

            return res.status(201).json(doc.map((a) => {
              const result = {
                id: a['_id'],
                userId: a['userId'],
                name: a['name'],
                type: a['type'],
                isPublic: a['isPublic'],
                parentId: a['parentId'],
              }
              return result;
            }))
          });
    });
  };
    
  /**
   * Retrieve the file and documents based on the id.
   * @param {*} req 
   * @param {*} res 
  */
  static async getShow(req, res) {
  }
}