import express from 'express';

import mountRoutes from './routes/index';

const app = express();

mountRoutes(app);

app.listen(process.env.PORT || 5000);
