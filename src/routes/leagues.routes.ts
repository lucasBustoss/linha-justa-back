import { Router } from 'express';
import LeagueService from '../services/LeagueService';

const testsRouter = Router();

testsRouter.get('/', async (request, response) => {
  try {
    const leagueService = new LeagueService();
    const leagues = await leagueService.find();

    return response.json(leagues);
  } catch (err) {
    console.log(err);
    return response.status(400).json({ error: err.message });
  }
});

testsRouter.post('/', async (request, response) => {
  try {
    const leagueService = new LeagueService();

    const { country, name } = request.body;

    const leagues = await leagueService.create(country, name);

    return response.json(leagues);
  } catch (err) {
    console.log(err);
    return response.status(400).json({ error: err.message });
  }
});

export default testsRouter;
