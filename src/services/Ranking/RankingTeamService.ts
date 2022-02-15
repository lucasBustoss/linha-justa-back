import { EntityManager, getRepository, Repository } from 'typeorm';

import RankingTeam from '../../models/Ranking/RankingTeam';

import TeamService from '../TeamService';

class RankingService {
  rankingTeamRepository: Repository<RankingTeam>;

  constructor() {
    this.rankingTeamRepository = getRepository(RankingTeam);
  }

  public async find(): Promise<RankingTeam[]> {
    const rankings = await this.rankingTeamRepository.find();

    return rankings;
  }

  public async create(
    ranking_id: string,
    league_id: string,
    categoriesQuantity: number,
    transaction: EntityManager,
  ): Promise<void> {
    const teamService = new TeamService();
    const teams = await teamService.findByLeague(league_id);

    if (teams.length > 0) {
      const rankingTeams = [] as RankingTeam[];
      const category = String.fromCharCode(
        96 + categoriesQuantity,
      ).toUpperCase();

      teams.forEach(team => {
        const rankingTeam = this.rankingTeamRepository.create({
          ranking_id,
          team_id: team.id,
          category,
          homeadvantage: 0,
          form: 0,
          shape: 0,
        });

        rankingTeams.push(rankingTeam);
      });

      await transaction.save(rankingTeams);
    }
  }
}

export default RankingService;
