import AppController from '../controllers/AppController';
import UserController from '../controllers/UsersController';
import AuthController from '../controllers/AuthController';
import { getUserFromXToken } from '../utils/auth';

const mountRoutes = (app) => {
  app.get('/status', AppController.getStatus);
  app.get('/stats', AppController.getStats);

  app.post('/users', UserController.postNew);
  app.get('/users/me', UserController.getMe);

  app.get('/connect', AuthController.getConnect);
  app.get('/disconnect', getUserFromXToken, AuthController.getDisconnect);
};

export default mountRoutes;
