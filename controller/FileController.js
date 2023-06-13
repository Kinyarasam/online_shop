#!/usr/bin/env node

export default class FileController {
  static postUpload(req, res) {
    return res.status(200).json({ msg: 'Hit' });
  }
}