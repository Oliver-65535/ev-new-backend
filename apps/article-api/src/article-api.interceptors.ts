import * as shell from 'shelljs';

import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';

import { articleConf } from '@app/configuration';
import { diskStorage } from 'multer';
import { docFileValidator } from '@app/common/file/file.validator';

export const FILE_INTERCEPTOR = FileInterceptor('file', {
  storage: diskStorage({
    destination: (req, file, cb) => getDestination(req, file, cb),
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  }),
  fileFilter: docFileValidator,
});

export const FILE_MULTIPLE_INTERCEPTOR = FileFieldsInterceptor(
  [{ name: 'files', maxCount: articleConf.filesMaxCount }],
  {
    storage: diskStorage({
      destination: (req, file, cb) => getDestination(req, file, cb),
      filename: (req, file, cb) => {
        cb(null, file.originalname);
      },
    }),
    fileFilter: docFileValidator,
  },
);

const getDestination = (req, file, cb) => {
  const randomName = Array(48)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  const path = `${articleConf.filePath}${randomName}`;
  shell.mkdir('-p', path);
  cb(null, path);
};
