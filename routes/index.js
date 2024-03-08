import AppController from '../controllers/AppController';

const mountRoutes = (app) => {
  app.get('/status', AppController.getStatus);
  app.get('/stats', AppController.getStats);
};

export default mountRoutes;
