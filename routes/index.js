import AppController from '../controllers/AppController';
import UserController from '../controllers/UsersController';
import AuthController from '../controllers/AuthController';
import FilesController from '../controllers/FilesController';
import { getUserFromXToken } from '../utils/auth';

const mountRoutes = (app) => {
  app.get('/status', AppController.getStatus);
  app.get('/stats', AppController.getStats);

  app.post('/users', UserController.postNew);
  app.get('/users/me', getUserFromXToken, UserController.getMe);

  app.get('/connect', AuthController.getConnect);
  app.get('/disconnect', getUserFromXToken, AuthController.getDisconnect);

  app.post('/files', getUserFromXToken, FilesController.postUpload);
  app.get('/files/:id', getUserFromXToken, FilesController.getShow);
  app.get('/files', getUserFromXToken, FilesController.getIndex);
  app.put('/files/:id/publish', getUserFromXToken, FilesController.putPublish);
  app.put('/files/:id/unpublish', getUserFromXToken, FilesController.putUnpublish);
};

export default mountRoutes;
