import * as shell from 'shelljs';

import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';

import { FileStoreConfigInterface } from './file-store.interfaces';
import config from 'config';
import { diskStorage } from 'multer';
import { docFileValidator } from '@app/common/file/file.validator';

const fsconf = config.get<FileStoreConfigInterface>('fileStore');

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
  [{ name: 'files', maxCount: fsconf.filesMaxCount }],
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
  const path = `${fsconf.filePath}${req.params.articleId}`;
  shell.mkdir('-p', path);
  cb(null, path);
};
