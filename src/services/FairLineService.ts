import { Repository, getRepository, getManager } from 'typeorm';

import { addHours, format } from 'date-fns';
import RankingService from './Ranking/RankingService';

import FairLine from '../models/FairLine';
import ReferenceOdds from '../models/ReferenceOdds';
import OddLine from '../models/OddLine';
import OddLineService from './OddLineService';
import LeagueService from './LeagueService';

// interface Odds {
//   homeLine: string;
//   oddHome: string;
//   awayLine: string;
//   oddAway: string;
//   oddDiff: string;
// }

interface FairLineOdd {
  fairOdd: OddLine;
  fairLineOdds: OddLine;
}

interface InitialOdds {
  home: number;
  draw: number;
  away: number;
}

class FairLineService {
  fairLineRepository: Repository<FairLine>;

  constructor() {
    this.fairLineRepository = getRepository(FairLine);
  }

  public async find(fixture_id: string, ignoreOdds = false): Promise<FairLine> {
    const leagueService = new LeagueService();
    const entityManager = getManager();

    const fairLines = await entityManager.query(`
      SELECT 
        fixture_id ,
        fixtures.integration_id,
        fixtures.league_id,
	      fairlines.hometeam_id "homeTeam_id",
        hometeam.name "homeTeam_name",
	      fairlines.awayteam_id "awayTeam_id",
        awayteam.name "awayTeam_name",
	      homecategory "homeCategory", 
	      awaycategory "awayCategory",
        homeranking_team.homeadvantage "homeAdvantage",
        homeranking_team.form "homeForm_score",
        homeranking_team.shape "homeShape_score",
	      homemustwin_score "homeMustWin_score",
	      homemisses_score "homeMisses_score",
	      awaymustwin_score "awayMustWin_score",
	      awaymisses_score "awayMisses_score",
        0 as "awayHomeAdvantage",
        awayranking_team.form "awayForm_score",
        awayranking_team.shape "awayShape_score",
	      percentaddition "percentAddition",
	      initialhome_percent "initialHome_percent",
	      initialdraw_percent "initialDraw_percent",
	      initialaway_percent "initialAway_percent",
	      finalhome_percent "finalHome_percent",
	      finaldraw_percent "finalDraw_percent",
	      finalaway_percent "finalAway_percent"
      FROM fairlines
      INNER JOIN teams hometeam ON hometeam.id = hometeam_id
      INNER JOIN teams awayteam ON awayteam.id = awayteam_id
      INNER JOIN rankings_teams homeranking_team on homeranking_team.team_id = hometeam.id
      INNER JOIN rankings_teams awayranking_team on awayranking_team.team_id = awayteam.id 
      INNER JOIN fixtures ON fixtures.id = fairlines.fixture_id
      INNER JOIN leagues ON leagues.id = fixtures.league_id
      WHERE fixtures.date >= '${format(new Date(), 'yyyy-MM-dd')}'
      ${fixture_id ? `AND fixture_id = '${fixture_id}'` : ``}
      ORDER BY leagues.name, fixtures.date ASC
    `);

    for (let index = 0; index < fairLines.length; index++) {
      const fairLine = fairLines[index] as FairLine;

      fairLine.league = await leagueService.findById(fairLine.league_id);

      fairLine.homeAH = null;
      fairLine.awayAH = null;
      fairLine.homeOddAH = null;
      fairLine.awayOddAH = null;
      fairLine.homeAdjustedAH = null;
      fairLine.awayAdjustedAH = null;
      fairLine.homeAdjustedOdd = null;
      fairLine.awayAdjustedOdd = null;
      fairLine.evHome = null;
      fairLine.evAway = null;
      fairLine.oddManually = true;

      if (
        !ignoreOdds &&
        (fairLine.homeMustWin_score !== 0 ||
          fairLine.homeMisses_score !== 0 ||
          fairLine.awayMustWin_score !== 0 ||
          fairLine.awayMisses_score !== 0)
      ) {
        const offerOdds = await this.getOdds(fairLine.fixture_id);
        const fairLineOdd = (await this.getCalculatedOdds(
          fairLine,
          offerOdds,
        )) as FairLineOdd;

        if (offerOdds) {
          /* eslint-disable */
          const homeLine = offerOdds.homeLine.substring(5, offerOdds.homeLine.length);
          const awayLine = offerOdds.awayLine.substring(5, offerOdds.awayLine.length);
          const homeAdjustedLine = fairLineOdd.fairLineOdds.homeLine.substring(5, fairLineOdd.fairLineOdds.homeLine.length);
          const awayAdjustedLine = fairLineOdd.fairLineOdds.awayLine.substring(5, fairLineOdd.fairLineOdds.awayLine.length);

          fairLine.homeAH = homeLine === '+0' ? Number(homeLine).toFixed(1) : Number(homeLine).toFixed(2);
          fairLine.awayAH = awayLine === '+0' ? Number(awayLine).toFixed(1) : Number(awayLine).toFixed(2);
          fairLine.homeOddAH = offerOdds.oddHome;
          fairLine.awayOddAH = offerOdds.oddAway;
          fairLine.homeAdjustedAH = homeAdjustedLine === '+0' ? Number(homeAdjustedLine).toFixed(1) : Number(homeAdjustedLine).toFixed(2);
          fairLine.awayAdjustedAH = awayAdjustedLine === '+0' ? Number(awayAdjustedLine).toFixed(1) : Number(awayAdjustedLine).toFixed(2);
          fairLine.homeAdjustedOdd = fairLineOdd.fairOdd ? fairLineOdd.fairOdd.oddHome : null;
          fairLine.awayAdjustedOdd = fairLineOdd.fairOdd ? fairLineOdd.fairOdd.oddAway : null;
          fairLine.evHome = fairLineOdd.fairOdd ? Number(
            (Number(offerOdds.oddHome) / Number(fairLineOdd.fairOdd.oddHome) -
              1) *
            100,
          ).toFixed(2) : null;
          fairLine.evAway = fairLineOdd.fairOdd ? Number(
            (Number(offerOdds.oddAway) / Number(fairLineOdd.fairOdd.oddAway) - 1) * 100,
          ).toFixed(2) : null;

          fairLine.oddManually = offerOdds.manually;
        }
        /* eslint-enable */
      }
    }

    return fairLines.length === 1 ? fairLines[0] : fairLines;
  }

  public async findById(id: string): Promise<FairLine> {
    // const fairLine = await this.fairLineRepository.findOne(id);
    const fairLine = await this.fairLineRepository.findOne(id);

    return fairLine;
  }

  public async create(
    fixture_id: string,
    league_id: string,
    homeTeam_id: string,
    awayTeam_id: string,
  ): Promise<FairLine> {
    const rankingService = new RankingService();

    const ranking = await rankingService.find(league_id);

    if (ranking) {
      const homeTeamRanking = ranking.teams.filter(
        rt => rt.team_id === homeTeam_id,
      );

      const awayTeamRanking = ranking.teams.filter(
        rt => rt.team_id === awayTeam_id,
      );

      const initialOdds = await this.getInitialPercent(
        homeTeamRanking[0].category,
        awayTeamRanking[0].category,
      );

      const newFairLine = this.fairLineRepository.create({
        fixture_id,
        homeTeam_id,
        awayTeam_id,
        homeCategory: homeTeamRanking[0].category,
        awayCategory: awayTeamRanking[0].category,
        homeMustWin_score: 0,
        homeMisses_score: 0,
        awayMustWin_score: 0,
        awayMisses_score: 0,
        percentAddition: 0,
        initialHome_percent: initialOdds.home,
        initialDraw_percent: initialOdds.draw,
        initialAway_percent: initialOdds.away,
        finalHome_percent: initialOdds.home,
        finalDraw_percent: initialOdds.draw,
        finalAway_percent: initialOdds.away,
      });

      await this.fairLineRepository.save(newFairLine);

      return this.findById(newFairLine.id);
    }

    return null;
  }

  public async update(
    fixture_id: string,
    homeMustWin_score: number,
    homeMisses_score: number,
    awayMustWin_score: number,
    awayMisses_score: number,
    percentAddition: number,
    finalHome_percent: number,
    finalDraw_percent: number,
    finalAway_percent: number,
  ): Promise<FairLine> {
    const fairLine = await this.fairLineRepository.findOne({
      fixture_id,
    });

    if (fairLine) {
      fairLine.homeMustWin_score = homeMustWin_score;
      fairLine.homeMisses_score = homeMisses_score;
      fairLine.awayMustWin_score = awayMustWin_score;
      fairLine.awayMisses_score = awayMisses_score;
      fairLine.percentAddition = percentAddition;
      fairLine.finalHome_percent = finalHome_percent;
      fairLine.finalDraw_percent = finalDraw_percent;
      fairLine.finalAway_percent = finalAway_percent;

      this.fairLineRepository.save(fairLine);
    }

    return this.find(fixture_id);
  }

  private async getInitialPercent(
    home_category: string,
    away_category: string,
  ): Promise<InitialOdds> {
    const referenceOddsRepository = getRepository(ReferenceOdds);

    const referenceOdds = await referenceOddsRepository.findOne({
      home_category,
      away_category,
    });

    if (referenceOdds) {
      const initialOdds = {
        home: referenceOdds.percent_home,
        draw: referenceOdds.percent_draw,
        away: referenceOdds.percent_away,
      };

      return initialOdds;
    }

    return null;
  }

  public async getOdds(fixture_id: string): Promise<OddLine> {
    const oddLineService = new OddLineService();
    let odds;

    odds = await oddLineService.find(fixture_id);

    if (odds.length === 0) {
      odds = await oddLineService.create(fixture_id);
    }

    const existsOddOutOfDate = odds.filter(odd => {
      return addHours(odd.updated_at, 24) < new Date();
    });

    if (existsOddOutOfDate.length > 0) {
      odds = await oddLineService.update(fixture_id);
    }

    const odd = await this.getFairOdd(odds);

    return odd;
  }

  public async testCalculated(fixture_id: string): Promise<any> {
    const fairLine = await this.find(fixture_id, true);
    const oddds = await this.getOdds(fixture_id);

    return this.getCalculatedOdds(fairLine, oddds);
  }

  private async getCalculatedOdds(
    fairLine: FairLine,
    offerOdds: OddLine,
    ignoreOdds = false,
  ): Promise<FairLineOdd | FairLineOdd[]> {
    let odds = [];
    const baseLines = [];

    if (fairLine.finalHome_percent > fairLine.finalAway_percent) {
      baseLines.push(0.5, 0, 0.25, -0.5, -0.25, -1.5, -1, -0.75, -1.25);
    } else {
      baseLines.push(-0.5, 0, -0.25, 0.5, 0.25, 1.5, 1, 0.75, 1.25);
    }

    for (let index = 0; index < baseLines.length; index++) {
      const baseLine = baseLines[index];

      const defaultOddHome = await this.getOddByIndex(
        index,
        baseLine,
        fairLine,
        true,
        odds,
      );
      const defaultOddAway = await this.getOddByIndex(
        index,
        baseLine,
        fairLine,
        false,
        odds,
      );
      /*eslint-disable*/
      const defaultOdd = {
        numberLine: baseLine,
        homeLine: `Home ${baseLine >= 0 ? '+' : ''}${baseLine}`,
        oddHome: this.roundNumber(defaultOddHome),
        awayLine: `Away ${baseLine * -1 >= 0 ? '+' : ''}${baseLine * -1}`,
        oddAway: this.roundNumber(defaultOddAway),
        oddDiff: this.roundNumber(Math.abs(
          this.roundNumber(2 - defaultOddHome)) +
          Math.abs(this.roundNumber(2 - defaultOddAway),
          )),
      };

      odds.push(defaultOdd);
    }

    odds = odds.sort((a, b) => {
      if (a.numberLine > b.numberLine) return -1;
      if (a.numberLine <= b.numberLine) return 1;

      return 0;
    });

    const odd = odds.filter(o => offerOdds && o.homeLine === offerOdds.homeLine) as OddLine[];

    const fairLineOdds = this.getFairOdd(odds);

    if (fairLine.fixture_id === '7d6c22ee-2f22-4a26-98ca-2d8ca2919752') {
      // console.log(odds);
      // console.log(offerOdds.homeLine)
    }

    const fairOdd = odd && odd.length > 0 ? odd[0] : null;

    return !ignoreOdds ? { fairOdd, fairLineOdds } : odds;
  }

  private async getOddByIndex(
    index: number,
    oddLine: number,
    fairLine: FairLine,
    isHomeTeam: boolean,
    odds: OddLine[],
  ): Promise<number> {

    if (index === 0) {
      if (isHomeTeam) {
        return fairLine.finalHome_percent <= fairLine.finalAway_percent
          ? 1 / fairLine.finalHome_percent
          : 1 / (1 - fairLine.finalAway_percent);
      }

      return fairLine.finalAway_percent <= fairLine.finalHome_percent
        ? 1 / fairLine.finalAway_percent
        : 1 / (1 - fairLine.finalHome_percent);
    }

    if (index === 1) {
      if (isHomeTeam) {
        return (
          1 /
          (Number(fairLine.finalHome_percent) /
            (Number(fairLine.finalHome_percent) +
              Number(fairLine.finalAway_percent)))
        );
      }

      return (
        1 /
        (Number(fairLine.finalAway_percent) /
          (Number(fairLine.finalAway_percent) +
            Number(fairLine.finalHome_percent)))
      );
    }

    if (index === 2) {
      const numberLineBelow =
        fairLine.finalHome_percent > fairLine.finalAway_percent
          ? '+0.5'
          : '-0.5';

      const lineBaseAbove = odds.filter(
        odd => odd.homeLine === `Home ${numberLineBelow}`,
      );
      const lineBaseBelow = odds.filter(odd => odd.homeLine === 'Home +0');

      if (lineBaseAbove.length > 0 && lineBaseBelow.length > 0) {
        if (isHomeTeam) {
          /*eslint-disable*/
          return fairLine.finalHome_percent <= fairLine.finalAway_percent
            ? (Number(lineBaseBelow[0].oddHome) +
              Number(lineBaseAbove[0].oddHome)) / 2 :
            1 / (1 - 1 /
              (((Number(lineBaseBelow[0].oddAway) +
                Number(lineBaseAbove[0].oddAway))) /
                2));

        }

        return fairLine.finalAway_percent >= fairLine.finalHome_percent
          ? 1 / (1 - 1 /
            ((Number(lineBaseAbove[0].oddHome) +
              Number(lineBaseBelow[0].oddHome)) /
              2))
          : (Number(lineBaseAbove[0].oddAway) +
            Number(lineBaseBelow[0].oddAway)) / 2;
        /* eslint-enable */
      }

      return 0;
    }

    if (index === 3) {
      if (isHomeTeam) {
        return fairLine.finalHome_percent >= fairLine.finalAway_percent
          ? 1 / Number(fairLine.finalHome_percent)
          : 1 / (1 - Number(fairLine.finalAway_percent));
      }

      return fairLine.finalAway_percent >= fairLine.finalHome_percent
        ? 1 / Number(fairLine.finalAway_percent)
        : 1 / (1 - Number(fairLine.finalHome_percent));
    }

    if (index === 4) {
      const numberLineBelow =
        fairLine.finalHome_percent > fairLine.finalAway_percent
          ? '-0.5'
          : '+0.5';

      const lineBaseAbove = odds.filter(odd => odd.homeLine === 'Home +0');
      const lineBaseBelow = odds.filter(
        odd => odd.homeLine === `Home ${numberLineBelow}`,
      );

      if (lineBaseAbove.length > 0 && lineBaseBelow.length > 0) {
        if (isHomeTeam) {
          /*eslint-disable*/
          return fairLine.finalHome_percent >= fairLine.finalAway_percent
            ? (Number(lineBaseAbove[0].oddHome) +
              Number(lineBaseBelow[0].oddHome)) / 2 :
            1 / (1 - 1 /
              ((Number(lineBaseBelow[0].oddAway) +
                Number(lineBaseAbove[0].oddAway)) /
                2));

        }

        return fairLine.finalAway_percent <= fairLine.finalHome_percent
          ? 1 / (1 - 1 /
            ((Number(lineBaseAbove[0].oddHome) +
              Number(lineBaseBelow[0].oddHome)) /
              2))
          : (Number(lineBaseAbove[0].oddAway) +
            Number(lineBaseBelow[0].oddAway)) / 2;
        /* eslint-enable */
      }

      return 0;
    }

    if (index === 5) {
      const signalLine =
        fairLine.finalHome_percent > fairLine.finalAway_percent ? '-' : '+';

      const lineBase = odds.filter(
        odd => odd.homeLine === `Home ${signalLine}0.5`,
      );

      const factorAH1Goal = await this.getFactorAH1Goal(fairLine);

      /* eslint-disable */
      if (isHomeTeam) {
        return oddLine > 0
          ? 1 /
          (1 - 1 / (1 / (1 / Number(lineBase[0].oddAway) * factorAH1Goal)))
          : 1 / ((1 / Number(lineBase[0].oddHome)) * factorAH1Goal);
      }

      return oddLine > 0
        ? 1 / ((1 / Number(lineBase[0].oddAway)) * factorAH1Goal)
        : 1 /
        (1 - 1 / (1 / ((1 / Number(lineBase[0].oddHome)) * factorAH1Goal)));
      /* eslint-enable */
    }

    if (index === 6) {
      const signalLine =
        fairLine.finalHome_percent > fairLine.finalAway_percent ? '-' : '+';

      const lineBaseAbove = odds.filter(
        odd => odd.homeLine === `Home ${signalLine}0.5`,
      );
      const lineBaseBelow = odds.filter(
        odd => odd.homeLine === `Home ${signalLine}1.5`,
      );

      /* eslint-disable */
      if (isHomeTeam) {
        return oddLine > 0
          ? 1 /
          (1 /
            Number(lineBaseAbove[0].oddHome) /
            (1 / Number(lineBaseAbove[0].oddHome) + 1 / Number(lineBaseBelow[0].oddAway)))
          : 1 /
          (1 /
            Number(lineBaseBelow[0].oddHome) /
            (1 / Number(lineBaseBelow[0].oddHome) + 1 / Number(lineBaseAbove[0].oddAway)));
      }

      return oddLine > 0
        ? 1 /
        (1 /
          Number(lineBaseBelow[0].oddAway) /
          (1 / Number(lineBaseBelow[0].oddAway) +
            1 / Number(lineBaseAbove[0].oddHome)))
        : 1 /
        (1 /
          Number(lineBaseAbove[0].oddAway) /
          (1 / Number(lineBaseAbove[0].oddAway) +
            1 / Number(lineBaseBelow[0].oddHome)));
      /* eslint-enable */
    }

    if (index === 7) {
      const signalLine =
        fairLine.finalHome_percent > fairLine.finalAway_percent ? '-' : '+';

      const lineBaseAbove = odds.filter(
        odd => odd.homeLine === `Home ${signalLine}0.5`,
      );
      const lineBaseBelow = odds.filter(
        odd => odd.homeLine === `Home ${signalLine}1`,
      );

      /* eslint-disable */
      if (isHomeTeam) {
        return oddLine > 0
          ? (Number(lineBaseAbove[0].oddHome) +
            Number(lineBaseBelow[0].oddHome)) /
          2
          : 1 /
          (1 -
            1 /
            ((Number(lineBaseAbove[0].oddAway) +
              Number(lineBaseBelow[0].oddAway)) /
              2));
      }

      return oddLine > 0
        ? 1 /
        (1 -
          1 /
          ((Number(lineBaseAbove[0].oddHome) +
            Number(lineBaseBelow[0].oddHome)) /
            2))
        : (Number(lineBaseAbove[0].oddAway) +
          Number(lineBaseBelow[0].oddAway)) /
        2;
      /* eslint-enable */
    }

    if (index === 8) {
      const signalLine =
        fairLine.finalHome_percent > fairLine.finalAway_percent ? '-' : '+';

      const lineBaseAbove = odds.filter(
        odd => odd.homeLine === `Home ${signalLine}1`,
      );
      const lineBaseBelow = odds.filter(
        odd => odd.homeLine === `Home ${signalLine}1.5`,
      );

      /* eslint-disable */
      if (isHomeTeam) {
        return oddLine > 0
          ? 1 /
          (1 -
            1 /
            ((Number(lineBaseAbove[0].oddAway) +
              Number(lineBaseBelow[0].oddAway)) /
              2))
          : (Number(lineBaseAbove[0].oddHome) +
            Number(lineBaseBelow[0].oddHome)) /
          2;
      }

      return oddLine > 0
        ? (Number(lineBaseAbove[0].oddAway) +
          Number(lineBaseBelow[0].oddAway)) /
        2
        : 1 /
        (1 -
          1 /
          ((Number(lineBaseAbove[0].oddHome) +
            Number(lineBaseBelow[0].oddHome)) /
            2));
      /* eslint-enable */
    }

    return 0;
  }

  private getFactorAH1Goal(fairLine: FairLine): number {
    if (fairLine.finalHome_percent > 0.6 || fairLine.finalAway_percent > 0.6) {
      return 0.62;
    }

    if (
      fairLine.finalHome_percent < 0.42 &&
      fairLine.finalAway_percent < 0.42
    ) {
      return 0.48;
    }

    return 0.55;
  }

  private roundNumber(number: number): number {
    return Math.round(number * 100) / 100;
  }

  private getFairOdd(odds: OddLine[]) {
    return (
      (odds.length &&
        odds.reduce((prev, curr) => {
          return prev.oddDiff < curr.oddDiff ? prev : curr;
        })) ||
      null
    );
  }
}

export default FairLineService;
