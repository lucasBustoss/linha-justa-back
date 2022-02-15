import { getRepository, Repository } from 'typeorm';

import LeagueTeam from '../models/LeagueTeam';
import Team from '../models/Team';

import footballApi from '../config/footballApi';

// #region Interfaces

interface TeamsResponseDataResponseTeam {
  id: number;
  name: string;
}

interface TeamsResponseDataResponse {
  team: TeamsResponseDataResponseTeam;
}

interface TeamsResponseData {
  results: number;
  response: TeamsResponseDataResponse[];
}

interface TeamsResponse {
  data: TeamsResponseData;
}

// #endregion

class TeamService {
  teamRepository: Repository<Team>;

  constructor() {
    this.teamRepository = getRepository(Team);
  }

  public async find(): Promise<Team[]> {
    const leagues = await this.teamRepository.find();

    return leagues;
  }

  public async getTeamsByLeague(
    league_id: string,
    integrationLeague_id: number,
    season: number,
  ): Promise<void> {
    const teamsResponse = (await footballApi.get(`/teams`, {
      params: {
        league: integrationLeague_id,
        season,
      },
    })) as TeamsResponse;

    if (teamsResponse.data.results > 0) {
      for (let index = 0; index < teamsResponse.data.response.length; index++) {
        const integrationTeam = teamsResponse.data.response[index].team;

        let team = await this.teamRepository.findOne({
          integration_id: integrationTeam.id,
        });

        if (!team) {
          const newTeam = {
            integration_id: integrationTeam.id,
            name: integrationTeam.name,
          };

          team = await this.teamRepository.save(newTeam);
        }

        await this.createLeagueTeam(league_id, team.id);
      }
    }
  }

  private async createLeagueTeam(league_id: string, team_id: string) {
    const leagueTeamRepository = getRepository(LeagueTeam);

    const leagueTeam = {
      league_id,
      team_id,
    };

    await leagueTeamRepository.save(leagueTeam);
  }
}

export default TeamService;
