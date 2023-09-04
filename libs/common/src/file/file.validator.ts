export const docFileValidator = (req, file, callback) => {
  if (!file.originalname.match(/\.(txt|pdf|docx|xlsx|doc|pgp)$/)) {
    return callback(new Error('This file format not allowed!'), false);
  }
  callback(null, true);
};
