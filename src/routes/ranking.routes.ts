import { Router } from 'express';
import RankingService from '../services/Ranking/RankingService';

const rankingRouter = Router();

rankingRouter.get('/', async (request, response) => {
  try {
    const rankingService = new RankingService();

    const { league_id } = request.query;
    const ranking = await rankingService.find(league_id.toString());

    return response.json(ranking);
  } catch (err) {
    console.log(err);
    return response.status(400).json({ error: err.message });
  }
});

rankingRouter.post('/', async (request, response) => {
  try {
    const rankingService = new RankingService();

    const { league_id, categories } = request.body;

    const ranking = await rankingService.create(league_id, categories);

    return response.json(ranking);
  } catch (err) {
    console.log(err);
    return response.status(400).json({ error: err.message });
  }
});

rankingRouter.patch('/', async (request, response) => {
  try {
    const rankingService = new RankingService();

    const { teams } = request.body;

    const ranking = await rankingService.updateRanking(teams);

    return response.json(ranking);
  } catch (err) {
    console.log(err);
    return response.status(400).json({ error: err.message });
  }
});

export default rankingRouter;
