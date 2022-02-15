import { getRepository, Repository, getConnection } from 'typeorm';

import Ranking from '../../models/Ranking/Ranking';
import RankingCategory from '../../models/Ranking/RankingCategory';

import RankingTeamService from './RankingTeamService';
import RankingCategoryService from './RankingCategoryService';

class RankingService {
  rankingRepository: Repository<Ranking>;

  constructor() {
    this.rankingRepository = getRepository(Ranking);
  }

  public async find(): Promise<Ranking[]> {
    const rankings = await this.rankingRepository.find({});

    return rankings;
  }

  public async create(
    league_id: string,
    categories: RankingCategory[],
  ): Promise<void> {
    const rankingTeamService = new RankingTeamService();
    const rankingCategoryService = new RankingCategoryService();

    await getConnection().transaction(async transaction => {
      const newRanking = new Ranking();
      newRanking.league_id = league_id;

      const ranking = await transaction.save(newRanking);

      await rankingCategoryService.create(ranking.id, categories, transaction);

      await rankingTeamService.create(
        ranking.id,
        league_id,
        categories.length,
        transaction,
      );
    });
  }
}

export default RankingService;
