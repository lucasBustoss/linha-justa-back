import { Router } from 'express';
import FairLineService from '../services/FairLineService';
import OddLineService from '../services/OddLineService';

const fairlineRouter = Router();

fairlineRouter.get('/', async (request, response) => {
  try {
    const leagueService = new FairLineService();

    const { fixture_id } = request.query;

    const leagues = await leagueService.find(
      fixture_id ? fixture_id.toString() : '',
    );

    return response.json(leagues);
  } catch (err) {
    console.log(err);
    return response.status(400).json({ error: err.message });
  }
});

fairlineRouter.get('/odds', async (request, response) => {
  try {
    const leagueService = new FairLineService();

    const leagues = await leagueService.getOdds(
      'd1afa34a-8302-4390-b3ed-8e5ea65dca73',
    );

    return response.json(leagues);
  } catch (err) {
    console.log(err);
    return response.status(400).json({ error: err.message });
  }
});

fairlineRouter.patch('/', async (request, response) => {
  try {
    const fairLineService = new FairLineService();

    const {
      fixture_id,
      homeMustWin_score,
      homeMisses_score,
      awayMustWin_score,
      awayMisses_score,
      percentAddition,
      finalHome_percent,
      finalDraw_percent,
      finalAway_percent,
    } = request.body;

    const fairLine = await fairLineService.update(
      fixture_id,
      homeMustWin_score,
      homeMisses_score,
      awayMustWin_score,
      awayMisses_score,
      percentAddition,
      finalHome_percent,
      finalDraw_percent,
      finalAway_percent,
    );

    return response.json(fairLine);
  } catch (err) {
    console.log(err);
    return response.status(400).json({ error: err.message });
  }
});

export default fairlineRouter;
