import { Router } from 'express';
import multer from 'multer';
import uploadConfig from './config/upload';
import OrphanagesController from './controllers/OrphanagesController';

const routes = Router();
const uploads = multer(uploadConfig); 

routes.get('/orphanages', OrphanagesController.index);
routes.get('/orphanage/:id', OrphanagesController.show);

routes.post('/orphanage-create', uploads.array('images'), OrphanagesController.create);

export default routes;