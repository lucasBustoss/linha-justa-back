import { getRepository, Repository } from 'typeorm';
import { format, parseISO } from 'date-fns';

import League from '../models/League';

import TeamsService from './TeamService';

import footballApi from '../config/footballApi';

class LeagueService {
  leagueRepository: Repository<League>;

  constructor() {
    this.leagueRepository = getRepository(League);
  }

  public async find(): Promise<League[]> {
    const leagues = await this.leagueRepository.find();

    return leagues;
  }

  public async create(country: string, name: string): Promise<void> {
    const teamsService = new TeamsService();

    const leagueResponse = await footballApi.get(`/leagues`, {
      params: {
        current: 'true',
        country,
        name,
      },
    });

    if (Number(leagueResponse.data.results) > 0) {
      const league = leagueResponse.data.response[0];

      const newLeague = {
        integration_id: Number(league.league.id),
        name: league.league.name,
        country: league.country.name,
        season_start: league.seasons[0].start,
        season_end: league.seasons[0].end,
      };

      const result = await this.leagueRepository.save(newLeague);

      const seasonYear = Number(
        format(parseISO(league.seasons[0].start), 'yyyy'),
      );

      await teamsService.getTeamsByLeague(
        result.id,
        newLeague.integration_id,
        seasonYear,
      );
    }
  }
}

export default LeagueService;
