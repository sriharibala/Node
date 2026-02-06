const FileModel = require('../Model/fileModel');

exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'File is required' });
    }

    // Prepare data for model
    const fileData = {
      originalName: req.file.originalname,
      fileName: req.file.filename,
      filePath: req.file.path,
      fileSize: req.file.size,
      mimeType: req.file.mimetype
    };

    // Call model
    const result = await FileModel.saveFile(fileData);

    res.status(201).json({
      message: 'File uploaded successfully',
      data: result
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
