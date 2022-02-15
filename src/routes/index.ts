import { Router } from 'express';
import leaguesRouter from './leagues.routes';
import rankingsRouter from './ranking.routes';
import teamsRouter from './teams.routes';

const routes = Router();

routes.use('/leagues', leaguesRouter);
routes.use('/rankings', rankingsRouter);
routes.use('/teams', teamsRouter);

export default routes;
