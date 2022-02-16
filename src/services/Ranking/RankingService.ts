import { getRepository, Repository, getConnection } from 'typeorm';

import Ranking from '../../models/Ranking/Ranking';
import RankingCategory from '../../models/Ranking/RankingCategory';

import RankingTeamService from './RankingTeamService';
import RankingCategoryService from './RankingCategoryService';
import TeamService from '../TeamService';
import RankingTeam from '../../models/Ranking/RankingTeam';

class RankingService {
  rankingRepository: Repository<Ranking>;

  constructor() {
    this.rankingRepository = getRepository(Ranking);
  }

  public async find(league_id: string): Promise<Ranking> {
    const teamService = new TeamService();
    const ranking = await this.rankingRepository.findOne({
      where: {
        league_id,
      },
    });

    if (ranking) {
      for (let index = 0; index < ranking.teams.length; index++) {
        const rankingTeam = ranking.teams[index];

        const team = await teamService.findById(rankingTeam.team_id);

        if (team) {
          rankingTeam.team_name = team.name;
        }
      }

      ranking.teams = ranking.teams.sort((a, b) => {
        return a.team_name.localeCompare(b.team_name);
      });

      return ranking;
    }

    return null;
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

  public async updateRanking(teams: RankingTeam[]): Promise<void> {
    const rankingTeamService = new RankingTeamService();

    await rankingTeamService.update(teams);
  }
}

export default RankingService;
