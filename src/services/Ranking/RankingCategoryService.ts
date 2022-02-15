import { EntityManager, getRepository, Repository } from 'typeorm';

import RankingCategory from '../../models/Ranking/RankingCategory';

class RankingService {
  rankingTeamRepository: Repository<RankingCategory>;

  constructor() {
    this.rankingTeamRepository = getRepository(RankingCategory);
  }

  public async find(): Promise<RankingCategory[]> {
    const rankings = await this.rankingTeamRepository.find();

    return rankings;
  }

  public async create(
    ranking_id: string,
    categories: RankingCategory[],
    transaction: EntityManager,
  ): Promise<void> {
    if (categories.length > 0) {
      const rankingCategories = [] as RankingCategory[];

      for (let index = 0; index < categories.length; index++) {
        const rankingCategory = categories[index];

        for (let j = 1; j <= 3; j++) {
          const tier = j === 1 ? '+' : j === 3 ? '-' : '';
          const newCategory = `${rankingCategory.category}${tier}`;

          const rankingTeam = this.rankingTeamRepository.create({
            ranking_id,
            category: newCategory,
            description: rankingCategory.description,
          });

          rankingCategories.push(rankingTeam);
        }
      }

      await transaction.save(rankingCategories);
    }
  }
}

export default RankingService;
