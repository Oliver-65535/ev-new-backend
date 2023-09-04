import * as fs from 'node:fs';

import { Readable } from 'stream';
import axios from 'axios';

// send file  use POST form-data server-side
export const sendFile = async (url, filePath) => {
  const FormData = require('form-data');
  const fileData = await require('fs').readFileSync(filePath);
  const fileName = require('path').basename(filePath);

  const formData = new FormData();
  formData.append('file', fileData, fileName);

  return axios.post(url, formData, {
    headers: formData.getHeaders(),
  });
};

export const downloadFile = async (url, filePath) => {
  const writer = fs.createWriteStream(filePath);

  const response = await axios.get<Readable>(url, {
    responseType: 'stream',
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
};
