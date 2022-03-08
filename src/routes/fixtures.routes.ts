import { Router } from 'express';
import FixtureService from '../services/FixtureService';

const fixtureRouter = Router();

fixtureRouter.get('/', async (request, response) => {
  try {
    const leagueService = new FixtureService();
    const leagues = await leagueService.find();

    return response.json(leagues);
  } catch (err) {
    console.log(err);
    return response.status(400).json({ error: err.message });
  }
});

fixtureRouter.get('/league', async (request, response) => {
  try {
    const leagueService = new FixtureService();
    const leagues = await leagueService.findAndGroupByLeague();

    return response.json(leagues);
  } catch (err) {
    console.log(err);
    return response.status(400).json({ error: err.message });
  }
});

fixtureRouter.post('/', async (request, response) => {
  try {
    const leagueService = new FixtureService();

    const { date } = request.body;

    const leagues = await leagueService.create(date);

    return response.json(leagues);
  } catch (err) {
    console.log(err);
    return response.status(400).json({ error: err.message });
  }
});

export default fixtureRouter;
