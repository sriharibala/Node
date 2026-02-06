const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  originalName: String,
  fileName: String,
  filePath: String,
  fileSize: Number,
  mimeType: String,
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

const File = mongoose.model('File', fileSchema);

exports.saveFile = async (data) => {
  const file = new File(data);
  return await file.save();
};
