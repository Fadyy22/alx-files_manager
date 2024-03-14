import AppController from '../controllers/AppController';
import UserController from '../controllers/UsersController';
import AuthController from '../controllers/AuthController';
import FilesController from '../controllers/FilesController';
import { xTokenAuthentication } from '../utils/auth';

const mountRoutes = (app) => {
  app.get('/status', AppController.getStatus);
  app.get('/stats', AppController.getStats);

  app.post('/users', UserController.postNew);
  app.get('/users/me', xTokenAuthentication, UserController.getMe);

  app.get('/connect', AuthController.getConnect);
  app.get('/disconnect', xTokenAuthentication, AuthController.getDisconnect);

  app.post('/files', xTokenAuthentication, FilesController.postUpload);
  app.get('/files/:id', xTokenAuthentication, FilesController.getShow);
  app.get('/files', xTokenAuthentication, FilesController.getIndex);
  app.put('/files/:id/publish', xTokenAuthentication, FilesController.putPublish);
  app.put('/files/:id/unpublish', xTokenAuthentication, FilesController.putUnpublish);
  app.get('/files/:id/data', FilesController.getFile);
};

export default mountRoutes;
