import { addDays, format, parseISO } from 'date-fns';
import { getRepository, MoreThan, Repository } from 'typeorm';
import footballApi from '../config/footballApi';

import Fixture from '../models/Fixture';
import FairLineService from './FairLineService';

import LeagueService from './LeagueService';
import TeamService from './TeamService';

class FixtureService {
  fixtureRepository: Repository<Fixture>;

  teamService: TeamService;

  leagueService: LeagueService;

  constructor() {
    this.fixtureRepository = getRepository(Fixture);
    this.teamService = new TeamService();
    this.leagueService = new LeagueService();
  }

  public async find(): Promise<Fixture[]> {
    const fixtures = await this.fixtureRepository.find({
      date: MoreThan(format(new Date(), 'yyyy-MM-dd')),
    });

    if (fixtures.length > 0) {
      for (let index = 0; index < fixtures.length; index++) {
        const fixture = fixtures[index];

        fixture.league = await this.leagueService.findById(fixture.league_id);
        fixture.hometeam = await this.teamService.findById(fixture.hometeam_id);
        fixture.awayteam = await this.teamService.findById(fixture.awayteam_id);
      }
    }

    return fixtures;
  }

  public async findById(fixture_id: string): Promise<Fixture> {
    const fixture = await this.fixtureRepository.findOne({
      id: fixture_id,
      date: MoreThan(format(new Date(), 'yyyy-MM-dd')),
    });

    if (fixture) {
      fixture.league = await this.leagueService.findById(fixture.league_id);
      fixture.hometeam = await this.teamService.findById(fixture.hometeam_id);
      fixture.awayteam = await this.teamService.findById(fixture.awayteam_id);
    }

    return fixture;
  }

  public async findAndGroupByLeague(): Promise<Fixture[]> {
    const leagues = await this.leagueService.find();
    const fixtures = [];

    for (let index = 0; index < leagues.length; index++) {
      const league = leagues[index];

      const fixturesByLeague = await this.fixtureRepository.find({
        league_id: league.id,
        date: MoreThan(format(new Date(), 'yyyy-MM-dd')),
      });

      if (fixturesByLeague.length > 0) {
        for (let j = 0; j < fixturesByLeague.length; j++) {
          const fixtureByLeague = fixturesByLeague[j];

          fixtureByLeague.league = await this.leagueService.findById(
            fixtureByLeague.league_id,
          );
          fixtureByLeague.hometeam = await this.teamService.findById(
            fixtureByLeague.hometeam_id,
          );
          fixtureByLeague.awayteam = await this.teamService.findById(
            fixtureByLeague.awayteam_id,
          );
        }

        const fixtureLeague = {
          league,
          fixtures: fixturesByLeague,
        };

        fixtures.push(fixtureLeague);
      }
    }

    return fixtures;
  }

  public async create(actualDate: string): Promise<Fixture[]> {
    const leagueService = new LeagueService();
    const teamService = new TeamService();
    const fairLineService = new FairLineService();

    const fromDate = format(parseISO(actualDate), 'yyyy-MM-dd');
    const toDate = format(addDays(parseISO(actualDate), 7), 'yyyy-MM-dd');
    const fixtures = [];

    const leagues = await leagueService.find();

    if (leagues.length > 0) {
      for (let index = 0; index < leagues.length; index++) {
        const league = leagues[index];

        const response = await footballApi.get(`/fixtures`, {
          params: {
            from: fromDate,
            to: toDate,
            timezone: 'America/Sao_Paulo',
            league: league.integration_id,
            season: format(league.season_start, 'yyyy'),
          },
        });

        if (response.data.response.length > 0) {
          for (let j = 0; j < response.data.response.length; j++) {
            const fixture = response.data.response[j];

            const existsFixture = await this.fixtureRepository.findOne({
              integration_id: fixture.fixture.id,
            });

            if (existsFixture) {
              continue;
            }

            const roundString = fixture.league.round;
            const groupStage =
              roundString.toLowerCase().includes('championship') ||
              roundString.toLowerCase().includes('regular season');

            const round = groupStage ? roundString.replace(/\D/g, '') : '999';

            if (round === '999') {
              console.log(roundString);
            }

            const hometeam = await teamService.findByIntegrationId(
              fixture.teams.home.id,
            );

            const awayteam = await teamService.findByIntegrationId(
              fixture.teams.away.id,
            );

            const newFixture = this.fixtureRepository.create({
              integration_id: fixture.fixture.id,
              date: fixture.fixture.date,
              league_id: league.id,
              round,
              hometeam_id: hometeam.id,
              awayteam_id: awayteam.id,
            });

            fixtures.push(newFixture);
          }
        }

        await this.fixtureRepository.save(fixtures);
      }
    }

    for (let index = 0; index < fixtures.length; index++) {
      const fixture = fixtures[index];

      await fairLineService.create(
        fixture.id,
        fixture.league_id,
        fixture.hometeam_id,
        fixture.awayteam_id,
      );
    }

    return fixtures;
  }
}

export default FixtureService;
