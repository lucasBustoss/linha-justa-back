import { Router } from 'express';
import leaguesRouter from './leagues.routes';
import rankingsRouter from './ranking.routes';
import teamsRouter from './teams.routes';
import fixtureRouter from './fixtures.routes';
import fairLinesRouter from './fairlines.routes';
import oddlineRouter from './oddline.routes';

const routes = Router();

routes.use('/leagues', leaguesRouter);
routes.use('/rankings', rankingsRouter);
routes.use('/teams', teamsRouter);
routes.use('/fixtures', fixtureRouter);
routes.use('/fairLines', fairLinesRouter);
routes.use('/odds', oddlineRouter);

export default routes;
