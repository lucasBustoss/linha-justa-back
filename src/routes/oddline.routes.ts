import { Router } from 'express';
import OddLineService from '../services/OddLineService';

const fairlineRouter = Router();

fairlineRouter.get('/', async (request, response) => {
  try {
    const leagueService = new OddLineService();

    const odds = await leagueService.find(
      'f645d268-234b-49c5-99c7-edd01d08650d',
    );

    return response.json(odds);
  } catch (err) {
    console.log(err);
    return response.status(400).json({ error: err.message });
  }
});

fairlineRouter.post('/', async (request, response) => {
  try {
    const leagueService = new OddLineService();

    const { odds } = request.body;

    await leagueService.createOfferOdd(odds);

    return response.json({ message: 'Odd inserida com sucesso' });
  } catch (err) {
    console.log(err);
    return response.status(400).json({ error: err.message });
  }
});

fairlineRouter.delete('/', async (request, response) => {
  try {
    const leagueService = new OddLineService();

    const { odds } = request.body;
    console.log(odds);

    await leagueService.deleteOfferOdd(odds);

    return response.json({ message: 'Odd excluída com sucesso' });
  } catch (err) {
    console.log(err);
    return response.status(400).json({ error: err.message });
  }
});

export default fairlineRouter;
