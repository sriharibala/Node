const fs = require('fs');
const path = require('path');
const FileModel = require('../Model/fileModel');

exports.uploadFile = async (req, res) => {
  try {
    const { originalName, mimeType, fileData } = req.body;

    if (!fileData) {
      return res.status(400).json({ message: 'File data is required' });
    }

    const buffer = Buffer.from(fileData, 'base64');

    const fileName = Date.now() + '-' + originalName;
    const filePath = path.join('uploads', fileName);

    fs.writeFileSync(filePath, buffer);

    const fileDetails = {
      originalName,
      fileName,
      filePath,
      fileSize: buffer.length,
      mimeType
    };

    const result = await FileModel.saveFile(fileDetails);

    res.status(201).json({
      message: 'File uploaded successfully',
      data: result
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
