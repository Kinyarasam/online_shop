import express from 'express';
import AppController from '../controller/Appcontroller';
import UsersController from '../controller/UsersController';
import AuthController from '../controller/AuthController';
import FilesController from '../controller/FilesController';

const router = express.Router();

router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);

/* Create a new User */
router.post('/users', UsersController.postNew);

/* Authenticate a User. */
router.get('/connect', AuthController.getConnect);
router.get('/users/me', UsersController.getMe);
router.get('/disconnect', AuthController.getDisconnect);

/* First file */
router.post('/files', FilesController.postUpload);

/* Get and list file */
router.get('/files', FilesController.getIndex);
router.get('/files/:id', FilesController.getShow);

export default router;