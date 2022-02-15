import { Router } from 'express';
import TeamService from '../services/TeamService';

const leagueRouter = Router();

leagueRouter.get('/', async (request, response) => {
  try {
    const teamService = new TeamService();
    const teams = await teamService.find();

    return response.json(teams);
  } catch (err) {
    console.log(err);
    return response.status(400).json({ error: err.message });
  }
});

leagueRouter.get('/league', async (request, response) => {
  try {
    const teamService = new TeamService();
    const teams = await teamService.findByLeague(
      '5a985380-ff62-414a-9ea8-62484acdadd0',
    );

    return response.json(teams);
  } catch (err) {
    console.log(err);
    return response.status(400).json({ error: err.message });
  }
});

export default leagueRouter;
