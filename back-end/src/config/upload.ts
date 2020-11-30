import { response } from 'express';
import { request } from 'http';
import multer from 'multer';
import path from 'path';

export default {
    storage: multer.diskStorage({
        destination: path.join(__dirname, '..', '..', 'uploads'),
        filename: (request, file, cb) => {
            const file_name = `${Date.now()}-${file.originalname}`

            cb(null, file_name)
        }
    })
}
