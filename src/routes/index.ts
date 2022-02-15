import { Router } from 'express';
import leaguesRouter from './leagues.routes';

const routes = Router();

routes.use('/leagues', leaguesRouter);

export default routes;
