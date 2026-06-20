const fileModel = require("../models/files.model");

const upload = async (data) => {
  const newfile = await fileModel.create({
    fieldName: data.fieldname,
    originalName: data.originalname,
    fileName: data.filename,
    mimeType: data.mimetype,
    size: data.size,
    path: data.path,
  });

  return newfile;
};

module.exports = { upload };
